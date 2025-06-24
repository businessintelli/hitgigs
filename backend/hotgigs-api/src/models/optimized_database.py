"""
Enhanced Supabase Database Service for HotGigs.ai
Optimized version with performance improvements, connection pooling, and caching
"""

import os
import logging
import asyncio
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timezone, timedelta
from functools import lru_cache
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PerformanceMonitor:
    """Monitor and log database performance metrics"""
    
    def __init__(self):
        self.query_times = []
        self.slow_query_threshold = 1.0  # 1 second
    
    def log_query_time(self, operation: str, duration: float, table: str = None):
        """Log query execution time"""
        self.query_times.append({
            'operation': operation,
            'duration': duration,
            'table': table,
            'timestamp': datetime.now(timezone.utc)
        })
        
        if duration > self.slow_query_threshold:
            logger.warning(f"Slow query detected: {operation} on {table} took {duration:.2f}s")
        else:
            logger.debug(f"Query: {operation} on {table} took {duration:.3f}s")
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        if not self.query_times:
            return {'message': 'No queries recorded'}
        
        durations = [q['duration'] for q in self.query_times]
        return {
            'total_queries': len(self.query_times),
            'avg_duration': sum(durations) / len(durations),
            'max_duration': max(durations),
            'min_duration': min(durations),
            'slow_queries': len([d for d in durations if d > self.slow_query_threshold])
        }

class OptimizedSupabaseService:
    """Enhanced Supabase database service with performance optimizations"""
    
    def __init__(self):
        """Initialize Supabase client with optimizations"""
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not self.url or not self.key:
            raise ValueError("Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        
        self.client: Client = create_client(self.url, self.key)
        self.performance_monitor = PerformanceMonitor()
        self._cache = {}
        self._cache_ttl = 300  # 5 minutes default TTL
        
        logger.info("Optimized Supabase client initialized successfully")
    
    def _time_operation(self, operation_name: str, table: str = None):
        """Decorator to time database operations"""
        def decorator(func):
            def wrapper(*args, **kwargs):
                start_time = time.time()
                try:
                    result = func(*args, **kwargs)
                    duration = time.time() - start_time
                    self.performance_monitor.log_query_time(operation_name, duration, table)
                    return result
                except Exception as e:
                    duration = time.time() - start_time
                    self.performance_monitor.log_query_time(f"{operation_name}_ERROR", duration, table)
                    raise
            return wrapper
        return decorator
    
    def _get_cache_key(self, operation: str, **kwargs) -> str:
        """Generate cache key for operation"""
        key_parts = [operation]
        for k, v in sorted(kwargs.items()):
            key_parts.append(f"{k}:{v}")
        return ":".join(key_parts)
    
    def _get_from_cache(self, cache_key: str) -> Optional[Any]:
        """Get data from cache if not expired"""
        if cache_key in self._cache:
            data, timestamp = self._cache[cache_key]
            if datetime.now(timezone.utc) - timestamp < timedelta(seconds=self._cache_ttl):
                logger.debug(f"Cache hit for {cache_key}")
                return data
            else:
                del self._cache[cache_key]
        return None
    
    def _set_cache(self, cache_key: str, data: Any, ttl: Optional[int] = None):
        """Set data in cache"""
        self._cache[cache_key] = (data, datetime.now(timezone.utc))
        if ttl:
            # Custom TTL implementation could be added here
            pass
    
    def get_client(self) -> Client:
        """Get the Supabase client instance"""
        return self.client
    
    @property
    def supabase(self) -> Client:
        """Backward compatibility property for accessing the client"""
        return self.client
    
    # Optimized job search using the new database function
    def search_jobs_optimized(self, search_term: Optional[str] = None, 
                             location: Optional[str] = None,
                             employment_type: Optional[str] = None,
                             experience_level: Optional[str] = None,
                             salary_min: Optional[int] = None,
                             salary_max: Optional[int] = None,
                             limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
        """Optimized job search using database function"""
        start_time = time.time()
        
        try:
            # Check cache first for common searches
            cache_key = self._get_cache_key(
                "search_jobs", 
                search_term=search_term, 
                location=location,
                employment_type=employment_type,
                limit=limit, 
                offset=offset
            )
            
            cached_result = self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Use the optimized database function
            result = self.client.rpc('search_jobs_optimized', {
                'search_term': search_term,
                'location_filter': location,
                'employment_type_filter': employment_type,
                'experience_level_filter': experience_level,
                'salary_min_filter': salary_min,
                'salary_max_filter': salary_max,
                'limit_count': limit,
                'offset_count': offset
            }).execute()
            
            jobs = result.data or []
            
            # Cache the result
            self._set_cache(cache_key, jobs)
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("search_jobs_optimized", duration, "jobs")
            
            return jobs
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("search_jobs_optimized_ERROR", duration, "jobs")
            logger.error(f"Error in optimized job search: {str(e)}")
            raise
    
    # Optimized user applications
    def get_user_applications_optimized(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user applications using optimized database function"""
        start_time = time.time()
        
        try:
            cache_key = self._get_cache_key("user_applications", user_id=user_id)
            cached_result = self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
            
            result = self.client.rpc('get_user_applications_optimized', {
                'user_id_param': user_id
            }).execute()
            
            applications = result.data or []
            
            # Cache with shorter TTL for user-specific data
            self._set_cache(cache_key, applications)
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_user_applications_optimized", duration, "job_applications")
            
            return applications
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_user_applications_optimized_ERROR", duration, "job_applications")
            logger.error(f"Error getting user applications: {str(e)}")
            raise
    
    # Optimized company statistics
    def get_company_stats_optimized(self, company_id: str) -> Dict[str, Any]:
        """Get company statistics using optimized database function"""
        start_time = time.time()
        
        try:
            cache_key = self._get_cache_key("company_stats", company_id=company_id)
            cached_result = self._get_from_cache(cache_key)
            if cached_result is not None:
                return cached_result
            
            result = self.client.rpc('get_company_stats', {
                'company_id_param': company_id
            }).execute()
            
            stats = result.data[0] if result.data else {}
            
            # Cache company stats for longer
            self._set_cache(cache_key, stats)
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_company_stats", duration, "companies")
            
            return stats
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_company_stats_ERROR", duration, "companies")
            logger.error(f"Error getting company stats: {str(e)}")
            raise
    
    # Enhanced generic operations with performance monitoring
    def create_record(self, table: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new record with performance monitoring"""
        start_time = time.time()
        
        try:
            result = self.client.table(table).insert(data).execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("create_record", duration, table)
            
            if result.data:
                logger.info(f"Created record in {table}: {result.data[0].get('id', 'unknown')}")
                # Invalidate related caches
                self._invalidate_table_cache(table)
                return result.data[0]
            return None
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("create_record_ERROR", duration, table)
            logger.error(f"Error creating record in {table}: {str(e)}")
            raise
    
    def get_record_by_id(self, table: str, record_id: str, use_cache: bool = True) -> Optional[Dict[str, Any]]:
        """Get a record by ID with caching"""
        start_time = time.time()
        
        try:
            cache_key = self._get_cache_key("get_record", table=table, id=record_id)
            
            if use_cache:
                cached_result = self._get_from_cache(cache_key)
                if cached_result is not None:
                    return cached_result
            
            result = self.client.table(table).select('*').eq('id', record_id).execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_record_by_id", duration, table)
            
            record = result.data[0] if result.data else None
            
            if record and use_cache:
                self._set_cache(cache_key, record)
            
            return record
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_record_by_id_ERROR", duration, table)
            logger.error(f"Error getting record from {table}: {str(e)}")
            raise
    
    def update_record(self, table: str, record_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a record with cache invalidation"""
        start_time = time.time()
        
        try:
            # Add updated_at timestamp
            data['updated_at'] = datetime.now(timezone.utc).isoformat()
            
            result = self.client.table(table).update(data).eq('id', record_id).execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("update_record", duration, table)
            
            if result.data:
                logger.info(f"Updated record in {table}: {record_id}")
                # Invalidate caches
                self._invalidate_record_cache(table, record_id)
                self._invalidate_table_cache(table)
                return result.data[0]
            return None
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("update_record_ERROR", duration, table)
            logger.error(f"Error updating record in {table}: {str(e)}")
            raise
    
    def _invalidate_record_cache(self, table: str, record_id: str):
        """Invalidate cache entries for a specific record"""
        cache_key = self._get_cache_key("get_record", table=table, id=record_id)
        if cache_key in self._cache:
            del self._cache[cache_key]
    
    def _invalidate_table_cache(self, table: str):
        """Invalidate cache entries related to a table"""
        keys_to_remove = []
        for key in self._cache.keys():
            if table in key:
                keys_to_remove.append(key)
        
        for key in keys_to_remove:
            del self._cache[key]
    
    # Batch operations for better performance
    def create_records_batch(self, table: str, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create multiple records in a single operation"""
        start_time = time.time()
        
        try:
            result = self.client.table(table).insert(records).execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("create_records_batch", duration, table)
            
            if result.data:
                logger.info(f"Created {len(result.data)} records in {table}")
                self._invalidate_table_cache(table)
                return result.data
            return []
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("create_records_batch_ERROR", duration, table)
            logger.error(f"Error creating batch records in {table}: {str(e)}")
            raise
    
    def get_records_optimized(self, table: str, filters: Optional[Dict[str, Any]] = None,
                             limit: Optional[int] = None, offset: Optional[int] = None,
                             order_by: Optional[str] = None, ascending: bool = True,
                             select_fields: str = '*', use_cache: bool = True) -> List[Dict[str, Any]]:
        """Optimized get records with selective field loading"""
        start_time = time.time()
        
        try:
            cache_key = self._get_cache_key(
                "get_records", 
                table=table, 
                filters=str(filters), 
                limit=limit, 
                offset=offset,
                order_by=order_by,
                ascending=ascending,
                select_fields=select_fields
            )
            
            if use_cache:
                cached_result = self._get_from_cache(cache_key)
                if cached_result is not None:
                    return cached_result
            
            query = self.client.table(table).select(select_fields)
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            # Apply ordering
            if order_by:
                query = query.order(order_by, desc=not ascending)
            
            # Apply pagination
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            
            result = query.execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_records_optimized", duration, table)
            
            records = result.data or []
            
            if use_cache:
                self._set_cache(cache_key, records)
            
            return records
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("get_records_optimized_ERROR", duration, table)
            logger.error(f"Error getting records from {table}: {str(e)}")
            raise
    
    # Performance monitoring methods
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        return self.performance_monitor.get_performance_stats()
    
    def clear_cache(self):
        """Clear all cached data"""
        self._cache.clear()
        logger.info("Cache cleared")
    
    def refresh_materialized_view(self):
        """Refresh the job search materialized view"""
        try:
            self.client.rpc('refresh_job_search_view').execute()
            logger.info("Job search materialized view refreshed")
        except Exception as e:
            logger.error(f"Error refreshing materialized view: {str(e)}")
    
    # Health check with performance metrics
    def health_check(self) -> Dict[str, Any]:
        """Enhanced health check with performance metrics"""
        try:
            start_time = time.time()
            
            # Test basic query
            result = self.client.table('users').select('id').limit(1).execute()
            
            query_time = time.time() - start_time
            
            # Get some basic stats
            user_count = self.count_records('users')
            job_count = self.count_records('jobs', {'status': 'active'})
            
            # Get performance stats
            perf_stats = self.get_performance_stats()
            
            return {
                'status': 'healthy',
                'connection': 'ok',
                'query_time_ms': round(query_time * 1000, 2),
                'stats': {
                    'total_users': user_count,
                    'active_jobs': job_count,
                    'cache_entries': len(self._cache)
                },
                'performance': perf_stats,
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.now(timezone.utc).isoformat()
            }
    
    # Backward compatibility methods
    def get_active_jobs(self, limit: Optional[int] = None, offset: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get active jobs using optimized search"""
        return self.search_jobs_optimized(limit=limit or 20, offset=offset or 0)
    
    def search_jobs(self, search_term: str, location: Optional[str] = None,
                   job_type: Optional[str] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Search jobs using optimized function"""
        return self.search_jobs_optimized(
            search_term=search_term,
            location=location,
            employment_type=job_type,
            limit=limit or 20
        )
    
    def count_records(self, table: str, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filtering"""
        start_time = time.time()
        
        try:
            query = self.client.table(table).select('id', count='exact')
            
            # Apply filters
            if filters:
                for key, value in filters.items():
                    query = query.eq(key, value)
            
            result = query.execute()
            
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("count_records", duration, table)
            
            return result.count or 0
            
        except Exception as e:
            duration = time.time() - start_time
            self.performance_monitor.log_query_time("count_records_ERROR", duration, table)
            logger.error(f"Error counting records in {table}: {str(e)}")
            raise

# Global instance function
def get_database_service():
    """Get optimized database service instance"""
    return OptimizedSupabaseService()

# Backward compatibility
DatabaseService = OptimizedSupabaseService
SupabaseService = OptimizedSupabaseService

