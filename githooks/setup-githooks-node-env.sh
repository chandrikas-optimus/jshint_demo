#!/bin/bash
LOCALNODE=$(which node);
LOCALNODE=${LOCALNODE//bin\/node/bin};
while read prePush;
do echo ${prePush//<%NODEPATH%>/$LOCALNODE};
done < ./githooks/pre-push-tmpl.sh > ./githooks/pre-push.sh;
exit $?
