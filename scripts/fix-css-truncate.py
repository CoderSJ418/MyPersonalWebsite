#!/usr/bin/env python3
"""Truncate unified-system.css to remove corrupted content after line 339."""
import os

css_path = os.path.join('src', 'assets', 'styles', 'unified-system.css')

with open(css_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f'Original lines: {len(lines)}')

# Keep only first 339 lines (the clean content)
clean_lines = lines[:339]

with open(css_path, 'w', encoding='utf-8', newline='\n') as f:
    f.writelines(clean_lines)

print(f'Truncated to {len(clean_lines)} lines')
print(f'Last line: {clean_lines[-1].rstrip()}')