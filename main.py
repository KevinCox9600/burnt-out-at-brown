from scrape_cab import scrape_cab
from scrape_cr import scrape_cr
from compile_data import compile_data


def main():
    print("####### SCRAPING CAB ######################")
    scrape_cab()
    print("####### SCRAPING CRITICAL REVIEW ##########")
    scrape_cr()
    print("####### COMPILING DATA ####################")
    compile_data()
    print("####### DONE ##############################")


if __name__ == "__main__":
    main()
