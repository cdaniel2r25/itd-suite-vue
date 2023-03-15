#!/bin/sh
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')
echo "Rama:$branch"
sonar-scanner \
  -Dsonar.projectKey=itd-suite \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://172.16.1.51:9100 \
  -Dsonar.login=f63b4a172d987bf25cbd82b1fef66d264e4d7a82 \
  -Dsonar.branch.name=$branch