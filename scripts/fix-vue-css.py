#!/usr/bin/env python3
"""Fix FeaturedProjects.vue CSS comment issue - lines 617-618 are bare text outside comment."""
import re

vue_path = 'src/components/home/FeaturedProjects.vue'

with open(vue_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix: merge the orphaned comment lines 617-618 into the comment block
# Current: ...Projects=CLUSTER, hover=requestAttentionSpike(local only) */
#          Active场景: 100% presence, Context/Inactive: 降级
#          ══════════════════════════════════════════════════ */
# Target: ...Projects=CLUSTER, hover=requestAttentionSpike(local only)
#          Active场景: 100% presence, Context/Inactive: 降级
#          ══════════════════════════════════════════════════ */

old_pattern = r'(Projects=CLUSTER, hover=requestAttentionSpike\(local only\)\s*\*/)\s*\n(\s*Active[^\n]*降级)\s*\n(\s*═+\s*\*/)'

new_text = r'Projects=CLUSTER, hover=requestAttentionSpike(local only)\n\2\n\3'

content_new = re.sub(old_pattern, new_text, content)

if content_new != content:
    with open(vue_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content_new)
    print('Fixed: merged orphaned comment lines into comment block')
else:
    print('No match found - trying alternative fix')
    # Alternative: just remove the orphaned lines
    lines = content.split('\n')
    new_lines = []
    skip_next = 0
    for i, line in enumerate(lines):
        if skip_next > 0:
            skip_next -= 1
            continue
        if 'Active场景: 100% presence, Context/Inactive: 降级' in line:
            # Skip this line and the next (═══ */)
            skip_next = 1
            # Also fix the previous line: remove */ from it
            if new_lines and '*/' in new_lines[-1]:
                new_lines[-1] = new_lines[-1].replace('*/', '')
            continue
        new_lines.append(line)
    
    content_new = '\n'.join(new_lines)
    with open(vue_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(content_new)
    print('Fixed: removed orphaned comment lines')