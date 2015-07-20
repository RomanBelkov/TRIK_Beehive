#!/usr/bin/awk -f

BEGIN	{ RS = "c3f97bee765fd86b209951ead9f8a583" ; ORS="" ; cnt = 0 ; }
	{ cnt++; if (cnt == 2) { print $0; exit 0; } ; fflush() ; }
