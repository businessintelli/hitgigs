#!/bin/bash

# HotGigs.ai Service and Port Monitor
# Comprehensive script to check running services and ports

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions for colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_header() { echo -e "${PURPLE}🔍 $1${NC}"; }
print_detail() { echo -e "${CYAN}   $1${NC}"; }

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check port status
check_port() {
    local port=$1
    local service_name=$2
    
    if command_exists lsof; then
        if lsof -i :$port > /dev/null 2>&1; then
            local pid=$(lsof -ti:$port | head -1)
            local cmd=$(ps -p $pid -o command= 2>/dev/null | cut -c1-50)
            print_success "$service_name running on port $port"
            print_detail "PID: $pid"
            print_detail "Command: $cmd"
            return 0
        else
            print_error "$service_name not running on port $port"
            return 1
        fi
    else
        print_warning "lsof not available, using netstat"
        if netstat -an 2>/dev/null | grep ":$port " | grep LISTEN > /dev/null; then
            print_success "$service_name appears to be running on port $port"
            return 0
        else
            print_error "$service_name not running on port $port"
            return 1
        fi
    fi
}

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    if command_exists curl; then
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
        if [ "$response" = "200" ]; then
            print_success "$name endpoint responding (HTTP 200)"
        elif [ "$response" = "000" ]; then
            print_error "$name endpoint not reachable"
        else
            print_warning "$name endpoint responding with HTTP $response"
        fi
    else
        print_info "curl not available, skipping endpoint test"
    fi
}

# Function to show system resources
show_system_resources() {
    print_header "System Resources"
    
    # Memory usage
    if command_exists free; then
        # Linux
        local mem_info=$(free -h | grep '^Mem:')
        local used=$(echo $mem_info | awk '{print $3}')
        local total=$(echo $mem_info | awk '{print $2}')
        print_detail "Memory: $used / $total used"
    elif command_exists vm_stat; then
        # macOS
        print_detail "Memory: $(vm_stat | grep 'Pages active' | awk '{print $3}') active pages"
    fi
    
    # Disk usage
    if command_exists df; then
        local disk_info=$(df -h . | tail -1)
        local used=$(echo $disk_info | awk '{print $3}')
        local total=$(echo $disk_info | awk '{print $2}')
        local percent=$(echo $disk_info | awk '{print $5}')
        print_detail "Disk: $used / $total ($percent used)"
    fi
    
    # Load average (Unix/Linux)
    if command_exists uptime; then
        local load=$(uptime | awk -F'load average:' '{print $2}')
        print_detail "Load average:$load"
    fi
    
    echo ""
}

# Function to show all listening ports
show_all_ports() {
    print_header "All Listening Ports"
    
    if command_exists lsof; then
        echo "Port    PID     Process"
        echo "----    ---     -------"
        lsof -i -P -n | grep LISTEN | awk '{print $9 "\t" $2 "\t" $1}' | sort -n
    elif command_exists netstat; then
        echo "Listening ports:"
        netstat -an | grep LISTEN | sort
    elif command_exists ss; then
        echo "Listening ports:"
        ss -tuln | grep LISTEN
    else
        print_error "No suitable command found to list ports"
    fi
    
    echo ""
}

# Function to show processes by name
show_processes() {
    local pattern=$1
    local name=$2
    
    print_header "$name Processes"
    
    if command_exists pgrep; then
        local pids=$(pgrep -f "$pattern")
        if [ -n "$pids" ]; then
            echo "PID     Command"
            echo "---     -------"
            for pid in $pids; do
                local cmd=$(ps -p $pid -o command= 2>/dev/null)
                echo "$pid    $cmd"
            done
        else
            print_info "No $name processes found"
        fi
    else
        ps aux | grep -E "$pattern" | grep -v grep
    fi
    
    echo ""
}

# Function to kill processes on a port
kill_port() {
    local port=$1
    
    if [ -z "$port" ]; then
        echo "Usage: kill_port <port_number>"
        return 1
    fi
    
    print_header "Killing processes on port $port"
    
    if command_exists lsof; then
        local pids=$(lsof -ti:$port)
        if [ -n "$pids" ]; then
            echo "Found processes: $pids"
            read -p "Kill these processes? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                lsof -ti:$port | xargs kill -9 2>/dev/null
                print_success "Processes killed"
            else
                print_info "Operation cancelled"
            fi
        else
            print_info "No processes found on port $port"
        fi
    else
        print_error "lsof not available, cannot kill processes"
    fi
}

# Main monitoring function
main_monitor() {
    clear
    echo "🔍 HotGigs.ai Service and Port Monitor"
    echo "======================================"
    echo "$(date)"
    echo ""
    
    # Check HotGigs.ai specific services
    print_header "HotGigs.ai Development Services"
    
    # Backend check
    if check_port 8000 "Backend API"; then
        test_endpoint "http://localhost:8000/api/health" "Backend Health"
    fi
    
    echo ""
    
    # Frontend check
    check_port 5173 "Frontend (Vite)"
    
    echo ""
    
    # Check alternative ports
    print_header "Alternative Development Ports"
    for port in 3000 3001 3002 5000 5001 8001; do
        if command_exists lsof && lsof -i :$port > /dev/null 2>&1; then
            local pid=$(lsof -ti:$port | head -1)
            local cmd=$(ps -p $pid -o comm= 2>/dev/null)
            print_info "Port $port: $cmd (PID: $pid)"
        fi
    done
    
    echo ""
    
    # Show Node.js processes
    show_processes "node" "Node.js"
    
    # Show Python processes
    show_processes "python" "Python"
    
    # Show system resources
    show_system_resources
}

# Interactive menu
show_menu() {
    echo ""
    echo "🎯 Available Actions:"
    echo "1. Full monitor (default)"
    echo "2. Show all listening ports"
    echo "3. Check specific port"
    echo "4. Kill processes on port"
    echo "5. Show Node.js processes"
    echo "6. Show Python processes"
    echo "7. Continuous monitoring"
    echo "8. Exit"
    echo ""
}

# Continuous monitoring
continuous_monitor() {
    print_header "Starting continuous monitoring (Press Ctrl+C to stop)"
    
    while true; do
        main_monitor
        echo ""
        print_info "Refreshing in 5 seconds..."
        sleep 5
    done
}

# Parse command line arguments
case "$1" in
    "ports")
        show_all_ports
        ;;
    "kill")
        kill_port "$2"
        ;;
    "check")
        if [ -n "$2" ]; then
            check_port "$2" "Service"
        else
            echo "Usage: $0 check <port_number>"
        fi
        ;;
    "node")
        show_processes "node" "Node.js"
        ;;
    "python")
        show_processes "python" "Python"
        ;;
    "continuous")
        continuous_monitor
        ;;
    "help"|"-h"|"--help")
        echo "HotGigs.ai Service Monitor"
        echo ""
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  (no args)    - Interactive monitor"
        echo "  ports        - Show all listening ports"
        echo "  check <port> - Check specific port"
        echo "  kill <port>  - Kill processes on port"
        echo "  node         - Show Node.js processes"
        echo "  python       - Show Python processes"
        echo "  continuous   - Continuous monitoring"
        echo "  help         - Show this help"
        echo ""
        echo "Examples:"
        echo "  $0                    # Interactive monitor"
        echo "  $0 ports              # List all ports"
        echo "  $0 check 8000         # Check port 8000"
        echo "  $0 kill 8000          # Kill processes on port 8000"
        echo "  $0 continuous         # Start continuous monitoring"
        ;;
    "")
        # Interactive mode
        while true; do
            main_monitor
            show_menu
            read -p "Choose an action (1-8): " choice
            
            case $choice in
                1|"")
                    continue
                    ;;
                2)
                    show_all_ports
                    read -p "Press Enter to continue..."
                    ;;
                3)
                    read -p "Enter port number: " port
                    check_port "$port" "Service"
                    read -p "Press Enter to continue..."
                    ;;
                4)
                    read -p "Enter port number: " port
                    kill_port "$port"
                    read -p "Press Enter to continue..."
                    ;;
                5)
                    show_processes "node" "Node.js"
                    read -p "Press Enter to continue..."
                    ;;
                6)
                    show_processes "python" "Python"
                    read -p "Press Enter to continue..."
                    ;;
                7)
                    continuous_monitor
                    ;;
                8)
                    print_info "Goodbye!"
                    exit 0
                    ;;
                *)
                    print_error "Invalid choice"
                    sleep 1
                    ;;
            esac
        done
        ;;
    *)
        echo "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

