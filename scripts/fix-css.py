#!/usr/bin/env python3
"""Fix unified-system.css: Remove corrupted VSD content, keep valid CSS rules."""
import re

with open('src/assets/styles/unified-system.css', 'r', encoding='utf-8-sig', errors='replace') as f:
    content = f.read()

# Remove all garbled lines (containing 閳 or 鈧 or 鈹 or 鐏 etc - PowerShell encoding corruption markers)
lines = content.split('\n')
clean_lines = []
skip_until_comment_end = False

for line in lines:
    # Skip lines with garbled characters
    if any(garbled in line for garbled in ['閳', '鈧', '鈹', '鐏', '鐔', '鐣', '鐢', '鐔', '鐓', '鐒', '鐑', '鐐', '鐏', '鎰', '鏅', '鏁', '灞', '灏', '灍', '瀹', '瀛', '濞', '濠', '濞', '濮', '婊', '妯', '宥', '蹇', '顒', '顓', '顖', '顗', '顙', '顚', '顛', '顜', '顝', '類', '顟', '顠', '顡', '顢', '顣', '顤', '顥', '顦', '顧', '顨', '顩', '顪', '顫', '顬', '顭', '顮', '顯', '顰', '顱', '顲', '顳', '顴', '页', '顶', '顷', '顸', '项', '顺', '须', '顼', '颀', '颁', '颂', '颃', '预', '颅', '领', '颇', '颈', '颉', '颊', '颋', '颌', '颍', '颎', '颏', '颐', '频', '颒', '颓', '颔', '颕', '颖', '颗', '题', '颙', '颚', '颛', '颜', '额', '颞', '颟', '颠', '颡', '颢', '颣', '颤', '颥', '颦', '颧', '風', '颩', '颪', '颫', '颬', '颭', '颮', '颯', '颰', '颱', '颲', '颳', '颴', '颵', '颶', '颷', '颸', '颹', '颺', '颻', '颼', '颽', '颾', '颿', '飀', '飁', '飂', '飃', '飄', '飅', '飆', '飇', '飈', '飉', '飊', '飋', '飌', '飍', '风', '飏', '飐', '飑', '飒', '飓', '飔', '飕', '飖', '飗', '飘', '飙', '飚', '飛', '飜', '飝', '飞', '飠', '飡', '飢', '飣', '飤', '飥', '飦', '飧', '飨', '飩', '飪', '飫', '飬', '飭', '飮', '飯', '飰', '飱', '飲', '飳', '飴', '飵', '飶', '飷', '飸', '飹', '飺', '飻', '飼', '飽', '飾', '飿', '餀', '餁', '餂', '餃', '餄', '餅', '餆', '餇', '餈', '餉', '養', '餋', '餌', '餍', '餎', '餏', '餐', '餑', '餒', '餓', '餔', '餕', '餖', '餗', '餘', '餙', '餚', '餛', '餜', '餝', '餞', '餟', '餠', '餡', '餢', '餣', '餤', '餥', '餦', '餧', '館', '餩', '餪', '餫', '餬', '餭', '餮', '餯', '餰', '餱', '餲', '餳', '餴', '餵', '餶', '餷', '餸', '餹', '餺', '餻', '餼', '餽', '餾', '餿', '饀', '饁', '饂', '饃', '饄', '饅', '饆', '饇', '饈', '饉', '饊', '饋', '饌', '饍', '饎', '饏', '饐', '饑', '饒', '饓', '饔', '饕', '饖', '饗', '饘', '饙', '饚', '饛', '饜', '饝', '饞', '饟', '饠', '饡', '饢', '饣', '饤', '饥', '饦', '饧', '饨', '饩', '饪', '饫', '饬', '饭', '饮', '饯', '饰', '饱', '饲', '饳', '饴', '饵', '饶', '饷', '饸', '饹', '饺', '饻', '饼', '饽', '饾', '饿', '馂', '馂', '馂']):
        continue
    # Skip orphaned CSS fragments from VSD removal
    if line.strip().startswith('translateY(') and 'z-index' not in line:
        continue
    if line.strip() == ':root {}':
        continue
    if line.strip().startswith('opacity:') and 'var(' not in line and 'transform' not in line and 'z-index' not in line and 'pointer-events' not in line and 'transition' not in line and '{' not in line:
        # Only skip if it's an orphaned property (not inside a rule block)
        continue
    clean_lines.append(line)

# Join and clean up multiple blank lines
result = '\n'.join(clean_lines)
result = re.sub(r'\n{4,}', '\n\n\n', result)

with open('src/assets/styles/unified-system.css', 'w', encoding='utf-8', newline='\n') as f:
    f.write(result)

print(f'Cleaned file: {len(lines)} -> {len(clean_lines)} lines')