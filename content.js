(function() {
    'use strict';

    // Функция для извлечения минимальной суммы из текста плейсхолдера
    function extractMinAmount(placeholderText) {
        if (!placeholderText) return null;
        
        // Паттерн для поиска: "от [число с пробелами] ₽ до"
        // Учитываем возможные неразрывные пробелы и специальный символ рубля
        const match = placeholderText.match(/от\s+([\d\s ]+?) ?₽?\s+до/);
        
        if (match) {
            // Удаляем ВСЕ не-цифровые символы (пробелы, неразрывные пробелы и т.д.)
            const cleanNumber = match[1].replace(/[^\d]/g, '');
            return parseInt(cleanNumber, 10);
        }
        
        // Запасной вариант: просто берем первое число после "от"
        const altMatch = placeholderText.match(/от\s+([\d\s ]+)/);
        if (altMatch) {
            const cleanNumber = altMatch[1].replace(/[^\d]/g, '');
            return parseInt(cleanNumber, 10);
        }
        
        console.log('Ozon Autofill: не удалось распознать сумму в тексте:', placeholderText);
        return null;
    }

    // Функция для поиска поля ввода и плейсхолдера
    function findAndSetupInput() {
        const inputField = document.querySelector('input[data-testid="money-input"]');
        const placeholderSpan = document.querySelector('span[data-testid="obi-test-id-placeholder"]');

        if (inputField && placeholderSpan) {
            // Извлекаем минимальную сумму
            const minAmount = extractMinAmount(placeholderSpan.textContent || '');

            if (minAmount) {
                // Обработчик клика по полю ввода
                const handleClick = () => {
                    // Устанавливаем значение
                    inputField.value = minAmount;
                    
                    // Триггерим события, чтобы сайт "узнал" об изменении
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                    inputField.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    console.log(`Ozon Autofill: установлена сумма ${minAmount} ₽`);
                };

                // Удаляем предыдущий обработчик, если был, и добавляем новый
                inputField.removeEventListener('click', handleClick);
                inputField.addEventListener('click', handleClick);

                console.log('Ozon Autofill: скрипт активирован');
            }
        }
    }

    // Запускаем поиск после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', findAndSetupInput);
    } else {
        findAndSetupInput();
    }

    // На случай, если элементы подгружаются динамически (например, через SPA)
    const observer = new MutationObserver(() => {
        findAndSetupInput();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();