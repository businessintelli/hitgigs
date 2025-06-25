#!/bin/bash

# HotGigs.ai Smart Directory Detection
# This script automatically detects the correct project structure

detect_project_structure() {
    local current_dir="$(pwd)"
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local project_root=""
    
    # Function to find project root
    find_project_root() {
        local search_dir="$1"
        
        # Look for key indicators of project root
        if [[ -f "$search_dir/package.json" ]] || [[ -f "$search_dir/.git/config" ]] || [[ -d "$search_dir/scripts" ]]; then
            echo "$search_dir"
            return 0
        fi
        
        # Go up one directory and try again
        local parent_dir="$(dirname "$search_dir")"
        if [[ "$parent_dir" != "$search_dir" ]]; then
            find_project_root "$parent_dir"
        else
            return 1
        fi
    }
    
    # Try to find project root starting from script directory
    project_root="$(find_project_root "$script_dir")"
    
    if [[ -z "$project_root" ]]; then
        # Try from current directory
        project_root="$(find_project_root "$current_dir")"
    fi
    
    if [[ -z "$project_root" ]]; then
        echo "ERROR: Could not find project root directory" >&2
        return 1
    fi
    
    echo "PROJECT_ROOT=$project_root"
    
    # Detect backend directory
    local backend_dir=""
    if [[ -d "$project_root/backend/hotgigs-api" ]]; then
        backend_dir="$project_root/backend/hotgigs-api"
    elif [[ -d "$project_root/backend" ]]; then
        backend_dir="$project_root/backend"
    elif [[ -f "$project_root/src/main.py" ]]; then
        backend_dir="$project_root"
    elif [[ -f "$project_root/main.py" ]]; then
        backend_dir="$project_root"
    else
        echo "ERROR: Could not find backend directory" >&2
        return 1
    fi
    
    echo "BACKEND_DIR=$backend_dir"
    
    # Detect main Python file
    local main_file=""
    if [[ -f "$backend_dir/src/main.py" ]]; then
        main_file="src/main.py"
    elif [[ -f "$backend_dir/main.py" ]]; then
        main_file="main.py"
    elif [[ -f "$backend_dir/app.py" ]]; then
        main_file="app.py"
    else
        echo "ERROR: Could not find main Python file" >&2
        return 1
    fi
    
    echo "MAIN_FILE=$main_file"
    
    # Detect frontend directory
    local frontend_dir=""
    if [[ -d "$project_root/frontend/hotgigs-frontend" ]]; then
        frontend_dir="$project_root/frontend/hotgigs-frontend"
    elif [[ -d "$project_root/frontend" ]]; then
        frontend_dir="$project_root/frontend"
    elif [[ -f "$project_root/package.json" ]]; then
        frontend_dir="$project_root"
    else
        echo "ERROR: Could not find frontend directory" >&2
        return 1
    fi
    
    echo "FRONTEND_DIR=$frontend_dir"
    
    # Detect package manager
    local package_manager=""
    if [[ -f "$frontend_dir/pnpm-lock.yaml" ]]; then
        package_manager="pnpm"
    elif [[ -f "$frontend_dir/yarn.lock" ]]; then
        package_manager="yarn"
    elif [[ -f "$frontend_dir/package-lock.json" ]]; then
        package_manager="npm"
    else
        package_manager="npm"  # default
    fi
    
    echo "PACKAGE_MANAGER=$package_manager"
    
    return 0
}

# Export the function for use in other scripts
export -f detect_project_structure

