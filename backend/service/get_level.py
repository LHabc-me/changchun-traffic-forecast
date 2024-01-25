def get_level(speed):
    if speed == 0:
        return 5
    if speed <= 10:
        return 1
    elif speed <= 20:
        return 2
    elif speed <= 30:
        return 3
    elif speed <= 40:
        return 4
    else:
        return 5
