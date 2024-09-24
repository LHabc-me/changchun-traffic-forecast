import json


def load_env():
    with open('./env.json', 'r') as f:
        env = json.load(f)
        if env["mode"] not in ['debug', 'release']:
            print("未知的启动模式。可选模式：['debug', 'release']")
            exit(1)
        if env["backend"]["port"] < 1024 or env["backend"]["port"] > 65535:
            print("端口号不合法。端口号范围：[1024, 65535]")
            exit(1)
        return env
