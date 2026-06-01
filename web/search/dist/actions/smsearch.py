"""
# tool
name: smsearch
description: Search the web
arguments:
    query:
        description: the search query
        required: true
"""
import sys
from smolagents.default_tools import WebSearchTool

executor = WebSearchTool()
try:
    print(executor.forward(sys.argv[1]))
except Exception as e:
    if ("No results found" in str(e)):
        print("No results found")
    else:
        raise(e)
