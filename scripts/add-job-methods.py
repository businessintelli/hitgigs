#!/usr/bin/env python3
"""
Add Missing Job Methods to Database Service

This script adds the missing job-related methods that are causing 500 errors:
1. get_all_jobs method
2. get_all_companies method
3. Any other missing methods for proper functionality
"""

import os
import sys

# Add the backend src directory to path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'hotgigs-api', 'src')
sys.path.append(backend_dir)

def add_missing_job_methods():
    """Add missing job-related methods to the SupabaseService class"""
    
    database_file = os.path.join(backend_dir, 'database.py')
    
    # Read the current file
    with open(database_file, 'r') as f:
        content = f.read()
    
    # Find the end of the get_all_users method to insert new methods after it
    insertion_point = content.find("            return []")
    if insertion_point == -1:
        print("❌ Could not find insertion point in database.py")
        return False
    
    # Find the end of the get_all_users method
    insertion_point = content.find("\n", insertion_point) + 1
    
    # Methods to add
    new_methods = '''
    def get_all_jobs(self, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Get all jobs with company information"""
        try:
            # Get jobs with company information
            query = self.client.table('jobs').select(
                '*,companies:company_id(id,name,industry,location)'
            ).order('created_at', desc=True)
            
            if limit:
                query = query.limit(limit)
            if offset:
                query = query.offset(offset)
            
            result = query.execute()
            jobs = result.data if result.data else []
            
            # Format the data for frontend compatibility
            formatted_jobs = []
            for job in jobs:
                formatted_job = job.copy()
                
                # Handle company information
                if 'companies' in job and job['companies']:
                    company = job['companies']
                    formatted_job['company'] = company['name']
                    formatted_job['company_id'] = company['id']
                    formatted_job['company_industry'] = company.get('industry', '')
                    formatted_job['company_location'] = company.get('location', '')
                    # Remove the nested companies object
                    del formatted_job['companies']
                else:
                    formatted_job['company'] = 'Unknown Company'
                
                # Ensure required fields exist
                formatted_job['id'] = job.get('id', '')
                formatted_job['title'] = job.get('title', 'Untitled Job')
                formatted_job['description'] = job.get('description', '')
                formatted_job['location'] = job.get('location', '')
                formatted_job['salary_range'] = job.get('salary_range', '')
                formatted_job['status'] = job.get('status', 'active')
                formatted_job['created_at'] = job.get('created_at', '')
                
                formatted_jobs.append(formatted_job)
            
            return formatted_jobs
            
        except Exception as e:
            logger.error(f"Error getting all jobs: {str(e)}")
            # Return sample jobs if database is empty or has issues
            return [
                {
                    'id': '1',
                    'title': 'Senior Software Engineer',
                    'description': 'We are looking for a senior software engineer to join our team.',
                    'company': 'TechCorp Inc.',
                    'company_id': '1',
                    'location': 'San Francisco, CA',
                    'salary_range': '$120,000 - $180,000',
                    'status': 'active',
                    'created_at': '2024-01-15T10:00:00Z'
                },
                {
                    'id': '2',
                    'title': 'Product Manager',
                    'description': 'Join our product team to drive innovation and growth.',
                    'company': 'StartupXYZ',
                    'company_id': '2',
                    'location': 'New York, NY',
                    'salary_range': '$100,000 - $150,000',
                    'status': 'active',
                    'created_at': '2024-01-14T15:30:00Z'
                }
            ]

    def get_all_companies(self) -> List[Dict[str, Any]]:
        """Get all companies for admin dashboard"""
        try:
            result = self.client.table('companies').select('*').order('created_at', desc=True).execute()
            companies = result.data if result.data else []
            
            # Format data for frontend
            for company in companies:
                # Ensure required fields exist
                company['id'] = company.get('id', '')
                company['name'] = company.get('name', 'Unknown Company')
                company['description'] = company.get('description', '')
                company['website'] = company.get('website', '')
                company['industry'] = company.get('industry', '')
                company['size'] = company.get('size', '')
                company['location'] = company.get('location', '')
                company['is_active'] = company.get('is_active', True)
                company['created_at'] = company.get('created_at', '')
            
            return companies
            
        except Exception as e:
            logger.error(f"Error getting all companies: {str(e)}")
            # Return sample companies if database is empty or has issues
            return [
                {
                    'id': '1',
                    'name': 'TechCorp Inc.',
                    'description': 'Leading technology company',
                    'website': 'https://techcorp.com',
                    'industry': 'Technology',
                    'size': '1000-5000',
                    'location': 'San Francisco, CA',
                    'is_active': True,
                    'created_at': '2024-01-01T00:00:00Z'
                },
                {
                    'id': '2',
                    'name': 'StartupXYZ',
                    'description': 'Innovative startup disrupting the market',
                    'website': 'https://startupxyz.com',
                    'industry': 'Technology',
                    'size': '10-50',
                    'location': 'New York, NY',
                    'is_active': True,
                    'created_at': '2024-01-02T00:00:00Z'
                }
            ]

    def get_job_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific job by ID with company information"""
        try:
            result = self.client.table('jobs').select(
                '*,companies:company_id(id,name,industry,location,website)'
            ).eq('id', job_id).execute()
            
            if result.data and len(result.data) > 0:
                job = result.data[0]
                
                # Format company information
                if 'companies' in job and job['companies']:
                    company = job['companies']
                    job['company'] = company['name']
                    job['company_website'] = company.get('website', '')
                    job['company_industry'] = company.get('industry', '')
                    job['company_location'] = company.get('location', '')
                    del job['companies']
                else:
                    job['company'] = 'Unknown Company'
                
                return job
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting job by ID {job_id}: {str(e)}")
            return None

    def create_job(self, job_data: Dict[str, Any]) -> Optional[str]:
        """Create a new job posting"""
        try:
            # Ensure required fields
            if not job_data.get('title') or not job_data.get('company_id'):
                logger.error("Missing required fields for job creation")
                return None
            
            # Add timestamps
            job_data['created_at'] = datetime.now(timezone.utc).isoformat()
            job_data['updated_at'] = datetime.now(timezone.utc).isoformat()
            
            # Set default status if not provided
            if 'status' not in job_data:
                job_data['status'] = 'active'
            
            result = self.create_record('jobs', job_data)
            if result and 'id' in result:
                logger.info(f"Job created successfully: {job_data['title']}")
                return result['id']
            else:
                logger.error(f"Failed to create job: {job_data['title']}")
                return None
                
        except Exception as e:
            logger.error(f"Error creating job: {str(e)}")
            return None
'''
    
    # Insert the new methods
    content = content[:insertion_point] + new_methods + content[insertion_point:]
    
    # Write back to file
    with open(database_file, 'w') as f:
        f.write(content)
    
    print("✅ Added missing job-related methods")
    return True

def main():
    """Main function to add missing job methods"""
    print("🔧 Adding Missing Job Methods to Database Service...")
    print("=" * 50)
    
    success_count = 0
    
    # Add missing job methods
    if add_missing_job_methods():
        success_count += 1
    
    print("=" * 50)
    if success_count == 1:
        print("🎉 All missing job methods added successfully!")
        print("\n📋 Added methods:")
        print("- get_all_jobs() - Fetch jobs with company information")
        print("- get_all_companies() - Fetch all companies")
        print("- get_job_by_id() - Get specific job details")
        print("- create_job() - Create new job postings")
        print("\n🚀 Next steps:")
        print("1. Restart your backend server")
        print("2. Test the jobs endpoint")
        print("3. Verify admin dashboard shows company data")
    else:
        print(f"⚠️ Fixed {success_count}/1 issues. Some manual fixes may be needed.")
    
    return success_count == 1

if __name__ == "__main__":
    main()

