const mainButtons = () => {
  const mainButton = document.getElementById("mainButton");
  const header = document.getElementById("header");
  const productsLink = document.getElementById("products");
  const calculatorLink = document.getElementById("calculator");
  const contactsLink = document.getElementById("contacts");

  header.addEventListener("click", (e) => {
    if (e.target.classList.contains("header-products")) {
      productsLink.scrollIntoView({ behavior: "smooth" });
    }

    if (e.target.classList.contains("header-amount")) {
      calculatorLink.scrollIntoView({ behavior: "smooth" });
    }

    if (e.target.classList.contains("header-contacts")) {
      contactsLink.scrollIntoView({ behavior: "smooth" });
    }
  });

  document.getElementsByClassName("header-burger")[0].onclick = function () {
    document.getElementById("menu").classList.add("header-open");
    document.querySelector("body").style.overflow = "hidden";
  };

  document.querySelectorAll("#menu *").forEach((item) => {
    item.onclick = () => {
      document.getElementById("menu").classList.remove("header-open");
      document.querySelector("body").style.overflow = "visible";
    };
  });

  mainButton.addEventListener("click", (e) => {
    productsLink.scrollIntoView({ behavior: "smooth" });
  });
};

const products = () => {
  const productsButton = document.querySelectorAll(".product-btn");
  const calculator = document.getElementById("calculator");
  const moreButton = document.querySelectorAll(".product-more-button");

  if (!productsButton.length || !calculator) {
    console.error("Не найдены необходимые элементы DOM");
    return;
  }

  productsButton.forEach((button) => {
    button.addEventListener("click", () => {
      const productInfo = button.parentElement;
      const productTitle =
        productInfo.querySelector(".product-title")?.innerText;
      const currentText = document.querySelector(".select-current");

      if (!productTitle || !currentText) {
        console.error("Не найдены эленты с информацией о продукте");
        return;
      }

      calculator.scrollIntoView({ behavior: "smooth" });
      currentText.innerText = productTitle;
    });
  });

  moreButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const product = e.target.closest(".product");
      const productImage = product.querySelector(".product-image");
      const productInfo = product.querySelector(".product-info");
      const buttonClose = product.querySelector(".product-more-close");
      if (e.target.classList.contains("1")) {
        productImage.classList.remove("is-active");
        productInfo.style.overflow = "visible";
        productInfo.style.marginBottom = "0";
        productInfo.style.maxHeight = "100%";
        e.target.style.display = "none";
        buttonClose.classList.add("is-active");
      } else {
        productImage.classList.remove("is-active");
        productInfo.style.overflow = "visible";
        productInfo.style.marginBottom = "0";
        productInfo.style.maxHeight = "100%";
        e.target.style.display = "none";
        buttonClose.classList.add("is-active");
      }
      buttonClose.addEventListener("click", (e) => {
        buttonClose.classList.remove("is-active");
        productImage.classList.add("is-active");
        productInfo.style.overflow = "hidden";
        productInfo.style.marginBottom = "25px";
        productInfo.style.maxHeight = "210px";
        button.style.display = "block";
      });
    });
  });
};

const calculate = () => {
  const initCustomSelect = () => {
    const select = document.getElementById("calculator-select");
    const selectHeader = select?.querySelector(".select-header");
    const selectIcon = document.getElementById("select-icon");
    const selectItems = select?.querySelectorAll(".select-item");
    const selectCurrent = select?.querySelector(".select-current");
    const numberInputs = document.querySelectorAll('input[type="number"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (
      !select ||
      !selectHeader ||
      !selectIcon ||
      !selectItems ||
      !selectCurrent
    ) {
      console.error("Не найдены необходимые элементы селекта");
      return;
    }

    let isSelectOpen = false;

    // Функция открытия/закрытия селекта
    const toggleSelect = (open) => {
      isSelectOpen = open !== undefined ? open : !isSelectOpen;

      if (isSelectOpen) {
        select.classList.add("is-active");
        selectIcon.style.transform = "rotate(180deg)";
        select.style.borderBottomRightRadius = "0";
        select.style.borderBottomLeftRadius = "0";
      } else {
        select.classList.remove("is-active");
        selectIcon.style.transform = "rotate(0)";
        select.style.borderBottomRightRadius = "15px";
        select.style.borderBottomLeftRadius = "15px";
      }
    };

    // Обработчик клика по заголовку селекта
    selectHeader.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });

    // Обработчики для элементов селекта
    selectItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        selectCurrent.textContent = item.textContent;
        toggleSelect(false);
      });
    });

    // Закрытие селекта при клике вне его
    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) {
        toggleSelect(false);
      }
    });

    // Обработка для input[type="number"]
    numberInputs.forEach((input) => {
      input.addEventListener("focus", () => {
        toggleSelect(false);
      });

      input.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("input-number-controls")) {
          e.stopPropagation();
        }
      });
    });

    // Обработка для checkbox элементов
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      checkbox.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
    });

    // Дополнительная защита
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isSelectOpen) {
        toggleSelect(false);
      }
    });

    // Защита от потери фокуса
    select.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
  };

  const range = () => {
    const range = document.getElementById("range");
    const hours = document.getElementById("hours-out");

    if (!range || !hours) {
      console.error("Не найдены элементы диапазона");
      return;
    }

    const updateValues = (value) => {
      range.value = value;
      hours.value = value;
      updateTotalPrice();
    };

    range.addEventListener("input", (e) => updateValues(e.target.value));
    hours.addEventListener("input", (e) => updateValues(e.target.value));
  };

  const updateTotalPrice = () => {
    const hours = document.getElementById("hours-out");
    const basePrice = 2000;
    const totalPriceElement = document.getElementById("totalPrice");
    const deliveryCheckbox = document.getElementById("delivery");

    if (!hours || !totalPriceElement || !deliveryCheckbox) {
      console.error("Не найдены элементы для расчета цены");
      return;
    }

    const hoursValue = parseInt(hours.value) || 0;
    let amountPerHours = basePrice * hoursValue;
    let amountPerHoursWithCheckbox = deliveryCheckbox.checked
      ? amountPerHours + 5000
      : amountPerHours;

    const formatter = new Intl.NumberFormat("ru");
    totalPriceElement.innerText = formatter.format(
      amountPerHoursWithCheckbox * 1.2
    );
  };

  const orderCall = () => {
    const calculatorButton = document.getElementById("calculatorButton");
    const popup = document.getElementById("popup");
    const popupClose = document.getElementById("popupClose");
    const body = document.querySelector("body");
    const overlay = document.getElementById("overlay");
    const popupProduct = document.querySelectorAll(".popup-product");
    const currentText = document.querySelector(".select-current");

    popupClose.addEventListener("click", (e) => {
      popup.classList.remove("is-active");
      body.style.overflow = "visible";
      overlay.style.display = "none";
      document.getElementById("popupForm").reset();
      document.getElementById("formSuccess").textContent =
     "";
    });

    calculatorButton.addEventListener("click", (e) => {
      popup.classList.add("is-active");
      body.style.overflow = "hidden";
      overlay.style.display = "block";
      popupProduct.forEach((product) => {
        if (!(currentText.innerText === "Выберите модель")) {
          product.innerText = currentText.innerText;
        } else {
          product.innerText = "";
        }
      });
    });
  };

  // Инициализация
  initCustomSelect();
  range();

  // Добавляем обработчик изменения чекбокса
  const deliveryCheckbox = document.getElementById("delivery");
  if (deliveryCheckbox) {
    deliveryCheckbox.addEventListener("change", updateTotalPrice);
  }

  // Инициализируем начальную цену
  updateTotalPrice();
  orderCall();
};

const popupValidate = () => {
  let number = $("#number");
  let name = $("#name");
  number.inputmask("+7(999)999-9999");
  const rawPhone = number.val().replace(/\D/g, "");

  name[0].onkeydown = (e) => {
    if (/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  document.getElementById("popupForm").addEventListener("submit", function (event) {
      event.preventDefault();

      const clearErrors = () => {
        document
          .querySelectorAll(".error-text")
          .forEach((error) => error.remove());
      };

      const formData = new FormData(this);
      const name = formData.get("name").trim();
      const number = formData.get("number").trim();

      // Валидация на клиенте
      let isValid = true;

      if (name.length === 0) {
        document.getElementById("nameError").textContent =
          "Введите имя";
        isValid = false;
      } else {
        document.getElementById("nameError").textContent = "";
      }

      if (number.length === 0) {
        document.getElementById("numberError").textContent =
          "Введите номер телефона";
        isValid = false;
      } else {
        document.getElementById("numberError").textContent ="";
      }

      if (!isValid) return;

      // Отправка данных через AJAX
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "sendmail.php", true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            document.getElementById("popupForm").reset();
            document.getElementById("formSuccess").textContent =
              "Сообщение успешно отправлено!";
          } else {
            // Выводим ошибки сервера
            if (response.errors) {
              for (const field in response.errors) {
                document.getElementById(field + "Error").textContent =
                  response.errors[field];
              }
            } else {
              document.getElementById("formSuccess").style.color = red
              document.getElementById("formSuccess").textContent =
                "Произошла ошибка при отправке: " + response.message;
            }
          }
        } else {
          document.getElementById("formSuccess").textContent =
            "Произошла ошибка при отправке запроса";
        }
      };
      xhr.send(formData);
    });
};

// Запускаем функции после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  mainButtons();
  products();
  calculate();
  popupValidate();
});
