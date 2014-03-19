#! /bin/bash

Sources_path=.
export Sources_path


gnome-terminal --working-directory=$Sources_path --command="./toyserver.sh" & 
