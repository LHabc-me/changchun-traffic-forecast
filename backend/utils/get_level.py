def get_level(speed):
    if speed == 0:
        return 5
    if speed <= 15:
        return 1
    elif 15 < speed <= 25:
        return 2
    elif 25 < speed <= 35:
        return 3
    elif 35 < speed <= 45:
        return 4
    elif speed > 45:
        return 5
