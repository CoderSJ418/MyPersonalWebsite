import json

path = r'C:\Users\Administrator.mengjing\.claude\projects\E--work-AI-MyPersonalWebsite\be6a5aac-4d4b-4528-a8e2-ee643aedac0d.jsonl'

with open(path, encoding='utf-8') as f:
    lines = f.readlines()

user_msgs = []
for line in lines:
    try:
        obj = json.loads(line)
        if obj.get('type') == 'user' and not obj.get('isMeta'):
            content = obj.get('message', {}).get('content', '')
            if isinstance(content, str) and content.strip():
                # skip command outputs
                if 'command-name' in content or 'command-args' in content or 'local-command-caveat' in content:
                    continue
                user_msgs.append(content)
    except:
        pass

print(f"Total user messages: {len(user_msgs)}")
print("\n=== LAST 20 USER MESSAGES ===\n")
for i, msg in enumerate(user_msgs[-20:], 1):
    print(f"--- Message {i} ---")
    print(msg[:500])
    print()
