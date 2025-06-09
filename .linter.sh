#!/bin/bash
cd /home/kavia/workspace/code-generation/cityfix-hub-27305-4e135e4d/cityfix_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

