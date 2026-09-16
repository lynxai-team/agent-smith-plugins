"""
# tool
description: Web search
arguments:
    query:
        description: The search query
        required: true
    time_limit:
        description: "The time limit. Possible values: d, w, m, y (for last day, week, month, year)"
"""
import sys
from ddgs import DDGS

# print("AARGS", sys.argv)
if len(sys.argv) < 2:
    raise ValueError("Provide a search query")
sargs = dict(max_results=10, safesearch="off")
if len(sys.argv) == 3:
    sargs["timelimit"] = sys.argv[2]
results = DDGS().text(sys.argv[1], **sargs)
rows = []
for res in results:
    txt = []
    txt.append(f"## {res["title"]}")
    txt.append(f"\nUrl: {res["href"]}")
    txt.append(f"\n{res["body"]}")
    rows.append("\n".join(txt))
print("\n\n".join(rows))
