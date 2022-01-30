from functools import reduce


def calc_max_hrs(cr_list):
    new_list = list(filter(lambda cr: not cr["Max Hours"] == "n/a", cr_list))

    if not new_list:
        return -1
    else:
        return reduce(lambda acc, cr: acc + float(cr["Max Hours"]), new_list, 0) / len(
            new_list
        )


def calc_avg_hrs(cr_list):
    new_list = list(filter(lambda cr: not cr["Avg Hours"] == "n/a", cr_list))

    if not new_list:
        return -1
    else:
        return reduce(lambda acc, cr: acc + float(cr["Avg Hours"]), new_list, 0) / len(
            new_list
        )


def calc_avg_rating(cr_list):
    new_list = list(filter(lambda cr: not cr["Course"] == "n/a", cr_list))

    if not new_list:
        return -1
    else:
        return reduce(lambda acc, cr: acc + float(cr["Course"]), new_list, 0) / len(
            new_list
        )
