NC='\033[0m'
Green='\033[0;32m'

echo "${Green} Installing scripts dependency ${NC}"
cd scripts && yarn install
cd ..

echo "${Green} Installing backend dependency ${NC}"
cd backend && yarn install
cd ..

echo "${Green} Installing frontend dependency ${NC}"
cd frontend && yarn install