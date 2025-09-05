#!/bin/bash

# Gateway Management API Test Script
echo "🚀 Testing Gateway Management API..."
echo "=================================="

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    
    echo -e "\n${YELLOW}Testing: $method $endpoint${NC}"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X $method "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Success (HTTP $http_code)${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}✗ Failed (HTTP $http_code, expected $expected_status)${NC}"
        echo "Response: $body"
    fi
}

# Test Health Check
echo -e "\n${YELLOW}Testing Health Check...${NC}"
curl -s http://localhost:3000 | jq '.' || echo "Health check response received"

# Test invalid routes (should return 404)
test_endpoint "GET" "/invalid-route" "" 404

# Note: The following tests require a database connection and sample data
# You can uncomment and run these after setting up your database with some test data

# Test Tenant endpoints
# test_endpoint "GET" "/tenants" "" 200

# Test Gateway endpoints  
# test_endpoint "GET" "/gateways" "" 200

# Test Device endpoints
# test_endpoint "GET" "/devices" "" 200
# test_endpoint "GET" "/devices/orphans" "" 200

echo -e "\n${GREEN}🎉 Basic API tests completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Set up your database with Atlas migrations"
echo "2. Create sample tenant, gateway, and device data"
echo "3. Test the full CRUD operations"
echo "4. Test validation with invalid data"
