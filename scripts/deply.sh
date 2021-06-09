NC='\033[0m'
Green='\033[0;32m'

echo "${Green} Pulling the latest code from github ${NC}"
git pull origin main

echo "${Green} Pushing the latest code to gitlab ${NC}"
git push origin -f main
