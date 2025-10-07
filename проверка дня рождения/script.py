from datetime import datetime, date

def get_birthday():
    """
    
    """
    print(" Введите вашу дату рождения ")
    print("=" * 40)
    
    # Запрашиваем год рождения
    while True:
        try:
            year = int(input("Введите год рождения (например, 1990): "))
            current_year = datetime.now().year
            if year < 1900 or year > current_year:
                print(f"⚠️  Год должен быть между 1900 и {current_year}")
                continue
            break
        except ValueError:
            print("❌ Ошибка! Введите целое число для года")
    
    # Запрашиваем месяц рождения
    while True:
        try:
            month = int(input("Введите месяц рождения (1-12): "))
            if month < 1 or month > 12:
                print("❌ Месяц должен быть от 1 до 12")
                continue
            break
        except ValueError:
            print("❌ Ошибка! Введите целое число для месяца")
    
    # Запрашиваем день рождения
    while True:
        try:
            day = int(input("Введите день рождения: "))
            
            # Проверяем корректность даты
            try:
                birthday = date(year, month, day)
                
                # Проверяем, что дата не в будущем
                if birthday > date.today():
                    print("❌ Дата рождения не может быть в будущем!")
                    continue
                    
                break
            except ValueError as e:
                print(f"❌ Некорректная дата: {e}")
                continue
                
        except ValueError:
            print("❌ Ошибка! Введите целое число для дня")
    
    return birthday

def get_weekday(birth_date):
    """
    Определяет день недели для даты рождения
    """
    days_ru = {
        'Monday': 'Понедельник',
        'Tuesday': 'Вторник', 
        'Wednesday': 'Среда',
        'Thursday': 'Четверг',
        'Friday': 'Пятница',
        'Saturday': 'Суббота',
        'Sunday': 'Воскресенье'
    }
    
    english_day = birth_date.strftime('%A')
    return days_ru.get(english_day, english_day)

def is_leap_year(year):
    """
    Определяет, является ли год високосным
    """
    if year % 4 != 0:
        return False
    elif year % 100 != 0:
        return True
    elif year % 400 != 0:
        return False
    else:
        return True

def calculate_age(birth_date):
    """
    Рассчитывает возраст пользователя
    """
    today = date.today()
    age = today.year - birth_date.year
    
    # Корректируем возраст, если день рождения еще не наступил в этом году
    if today.month < birth_date.month or (today.month == birth_date.month and today.day < birth_date.day):
        age -= 1
    
    return age

def display_digital_clock_date(birth_date):
    """
    Отображает дату в виде цифрового табло со звёздочками
    """
    # Паттерны цифр для цифрового табло (5x3)
    digit_patterns = {
        '0': ['***', '* *', '* *', '* *', '***'],
        '1': ['  *', '  *', '  *', '  *', '  *'],
        '2': ['***', '  *', '***', '*  ', '***'],
        '3': ['***', '  *', '***', '  *', '***'],
        '4': ['* *', '* *', '***', '  *', '  *'],
        '5': ['***', '*  ', '***', '  *', '***'],
        '6': ['***', '*  ', '***', '* *', '***'],
        '7': ['***', '  *', '  *', '  *', '  *'],
        '8': ['***', '* *', '***', '* *', '***'],
        '9': ['***', '* *', '***', '  *', '***'],
        '.': ['   ', '   ', ' * ', '   ', '   '],
        '/': ['   ', '  *', ' * ', '*  ', '   '],
        '-': ['   ', '   ', '***', '   ', '   ']
    }
    
    # Форматируем дату для отображения (дд.мм.гггг)
    date_str = birth_date.strftime('%d.%m.%Y')
    
    # Рассчитываем ширину табло
    width = len(date_str) * 4 + 4
    
    print("\n" + "=" * width)
    print("=" + " " * ((width - 26) // 2) + "ДАТА НА ЦИФРОВОМ ТАБЛО" + " " * ((width - 26) // 2) + "=")
    print("=" * width)
    
    # Отображаем каждый ряд цифр
    for row in range(5):
        line = ""
        for char in date_str:
            if char in digit_patterns:
                line += digit_patterns[char][row] + " "
            else:
                line += "   "
        print("=  " + line + " =")
    
    print("=" * width)

def main():
    """
    Основная функция программы
    """
    try:
        # Получаем дату рождения
        birthday = get_birthday()
        
        # Используем все функции
        weekday = get_weekday(birthday)
        is_leap = is_leap_year(birthday.year)
        age = calculate_age(birthday)
        
        # Выводим основную информацию
        print("\n" + "=" * 50)
        print("=           РЕЗУЛЬТАТЫ           =")
        print("=" * 50)
        
        print(f"=  Ваша дата рождения: {birthday.strftime('%d.%m.%Y')}")
        print(f"=  День недели: {weekday}")
        print(f"=  Ваш возраст: {age} {get_age_suffix(age)}")
        print(f"=  Год рождения: {birthday.year} {'(високосный)' if is_leap else '(не високосный)'}")
        print("=" * 50)
        
        # Отображаем дату в стиле цифрового табло
        display_digital_clock_date(birthday)
        
    except KeyboardInterrupt:
        print("\n\n Программа прервана пользователем!")
    except Exception as e:
        print(f"\n❌ Произошла ошибка: {e}")

def get_age_suffix(age):
    """
    Возвращает правильное окончание для возраста
    """
    if age % 10 == 1 and age % 100 != 11:
        return "год"
    elif age % 10 in [2, 3, 4] and age % 100 not in [12, 13, 14]:
        return "года"
    else:
        return "лет"

# Запуск программы
if __name__ == "__main__":
    main()