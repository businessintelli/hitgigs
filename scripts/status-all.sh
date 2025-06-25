#!/bin/bash

# HotGigs.ai System Status Script
# ================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend/hotgigs-api"
FRONTEND_DIR="frontend/hotgigs-frontend"
BACKEND_PID_FILE="$BACKEND_DIR/backend.pid"
FRONTEND_PID_FILE="$FRONTEND_DIR/frontend.pid"
BACKEND_PORT=8000
FRONTEND_PORT=3002

echo -e "${PURPLE}📊 HotGigs.ai System Status${NC}"
echo "============================"
echo ""

# Function to check service status
check_service_status() {
    local service_name=$1
    local pid_file=$2
    local port=$3
    local url=$4
    
    echo -e "${BLUE}$service_name Service:${NC}"
    echo "$(printf '%.0s-' {1..20})"
    
    # Check PID file
    if [[ -f "$pid_file" ]]; then
        PID=$(cat "$pid_file")
        if ps -p "$PID" > /dev/null 2>&1; then
            echo -e "   Process: ${GREEN}✅ Running (PID: $PID)${NC}"
            
            # Get process info
            PROCESS_INFO=$(ps -p "$PID" -o pid,ppid,etime,pcpu,pmem,cmd --no-headers 2>/dev/null || echo "N/A")
            echo "   Details: $PROCESS_INFO"
        else
            echo -e "   Process: ${RED}❌ Not running (stale PID file)${NC}"
            return 1
        fi
    else
        echo -e "   Process: ${YELLOW}⚠️  No PID file found${NC}"
    fi
    
    # Check port
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        PORT_PID=$(lsof -Pi :$port -sTCP:LISTEN -t)
        echo -e "   Port $port: ${GREEN}✅ In use (PID: $PORT_PID)${NC}"
    else
        echo -e "   Port $port: ${RED}❌ Not in use${NC}"
        return 1
    fi
    
    # Check HTTP response
    if [[ -n "$url" ]]; then
        if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
            echo -e "   HTTP: ${GREEN}✅ Responding${NC}"
            echo "   URL: $url"
        else
            echo -e "   HTTP: ${RED}❌ Not responding${NC}"
            echo "   URL: $url (unreachable)"
            return 1
        fi
    fi
    
    echo ""
    return 0
}

# Check system resources
echo -e "${BLUE}System Resources:${NC}"
echo "$(printf '%.0s-' {1..20})"
echo "   CPU Usage: $(top -l 1 -n 0 | grep "CPU usage" | awk '{print $3}' 2>/dev/null || echo "N/A")"
echo "   Memory: $(free -h 2>/dev/null | grep "Mem:" | awk '{print $3 "/" $2}' || echo "N/A")"
echo "   Disk: $(df -h . | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
echo ""

# Check backend
BACKEND_STATUS=0
check_service_status "Backend" "$BACKEND_PID_FILE" "$BACKEND_PORT" "http://localhost:$BACKEND_PORT/api/health" || BACKEND_STATUS=1

# Check frontend
FRONTEND_STATUS=0
check_service_status "Frontend" "$FRONTEND_PID_FILE" "$FRONTEND_PORT" "http://localhost:$FRONTEND_PORT" || FRONTEND_STATUS=1

# Check database connectivity (if backend is running)
if [[ $BACKEND_STATUS -eq 0 ]]; then
    echo -e "${BLUE}Database Status:${NC}"
    echo "$(printf '%.0s-' {1..20})"
    
    if curl -s --max-time 5 "http://localhost:$BACKEND_PORT/api/db-status" > /dev/null 2>&1; then
        DB_RESPONSE=$(curl -s --max-time 5 "http://localhost:$BACKEND_PORT/api/db-status" 2>/dev/null)
        if echo "$DB_RESPONSE" | grep -q "healthy\|ok\|connected" 2>/dev/null; then
            echo -e "   Database: ${GREEN}✅ Connected${NC}"
        else
            echo -e "   Database: ${YELLOW}⚠️  Status unclear${NC}"
        fi
    else
        echo -e "   Database: ${RED}❌ Cannot check (backend not responding)${NC}"
    fi
    echo ""
fi

# Overall system status
echo -e "${BLUE}Overall Status:${NC}"
echo "$(printf '%.0s-' {1..20})"

if [[ $BACKEND_STATUS -eq 0 ]] && [[ $FRONTEND_STATUS -eq 0 ]]; then
    echo -e "   System: ${GREEN}✅ All services running${NC}"
    echo ""
    echo "🌐 Access URLs:"
    echo "   • Main App: http://localhost:$FRONTEND_PORT"
    echo "   • Admin Panel: http://localhost:$FRONTEND_PORT/admin/login"
    echo "   • Status Dashboard: http://localhost:$FRONTEND_PORT/status"
    echo "   • Backend API: http://localhost:$BACKEND_PORT"
    echo "   • API Docs: http://localhost:$BACKEND_PORT/docs"
    echo ""
    echo "🔐 Admin Credentials:"
    echo "   • Email: admin@hotgigs.ai"
    echo "   • Password: admin123"
elif [[ $BACKEND_STATUS -eq 0 ]] && [[ $FRONTEND_STATUS -ne 0 ]]; then
    echo -e "   System: ${YELLOW}⚠️  Backend running, Frontend down${NC}"
    echo "   • Start Frontend: ./scripts/start-frontend.sh"
elif [[ $BACKEND_STATUS -ne 0 ]] && [[ $FRONTEND_STATUS -eq 0 ]]; then
    echo -e "   System: ${YELLOW}⚠️  Frontend running, Backend down${NC}"
    echo "   • Start Backend: ./scripts/start-backend.sh"
else
    echo -e "   System: ${RED}❌ All services down${NC}"
    echo "   • Start All: ./scripts/start-all.sh"
fi

echo ""
echo "🛠️  Management Commands:"
echo "   • Start All: ./scripts/start-all.sh"
echo "   • Stop All: ./scripts/stop-all.sh"
echo "   • Start Backend: ./scripts/start-backend.sh"
echo "   • Start Frontend: ./scripts/start-frontend.sh"
echo "   • Stop Backend: ./scripts/stop-backend.sh"
echo "   • Stop Frontend: ./scripts/stop-frontend.sh"
echo ""

# Log file information
echo "📝 Log Files:"
if [[ -f "$BACKEND_DIR/backend.log" ]]; then
    BACKEND_LOG_SIZE=$(du -h "$BACKEND_DIR/backend.log" | cut -f1)
    echo "   • Backend: $BACKEND_DIR/backend.log ($BACKEND_LOG_SIZE)"
else
    echo "   • Backend: No log file"
fi

if [[ -f "$FRONTEND_DIR/frontend.log" ]]; then
    FRONTEND_LOG_SIZE=$(du -h "$FRONTEND_DIR/frontend.log" | cut -f1)
    echo "   • Frontend: $FRONTEND_DIR/frontend.log ($FRONTEND_LOG_SIZE)"
else
    echo "   • Frontend: No log file"
fi

