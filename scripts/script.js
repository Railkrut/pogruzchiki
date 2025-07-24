/**
 * Основные функции приложения
 */
const App = {
  // Кэширование DOM элементов
  elements: {
    mainButton: document.getElementById("mainButton"),
    header: document.getElementById("header"),
    productsLink: document.getElementById("products"),
    calculatorLink: document.getElementById("calculator"),
    contactsLink: document.getElementById("contacts"),
    menu: document.getElementById("menu"),
    body: document.querySelector("body"),
    range: document.getElementById("range"),
    hoursOut: document.getElementById("hours-out"),
    totalPriceElement: document.getElementById("totalPrice"),
    deliveryCheckbox: document.getElementById("delivery"),
    calculatorButton: document.getElementById("calculatorButton"),
    popup: document.getElementById("popup"),
    popupClose: document.getElementById("popupClose"),
    overlay: document.getElementById("overlay"),
    popupForm: document.getElementById("popupForm"),
    formSuccess: document.getElementById("formSuccess"),
    loading: document.querySelector(".loading"),
    select: document.getElementById("calculator-select"),
    selectHeader: document.querySelector(".select-header"),
    selectIcon: document.getElementById("select-icon"),
    selectCurrent: document.querySelector(".select-current"),
  },

  // Инициализация приложения
  init() {
    this.setupMainButtons();
    this.setupProducts();
    this.setupCalculator();
    this.setupPopupValidation();
  },

  // Настройка основных кнопок и навигации
  setupMainButtons() {
    const {
      header,
      productsLink,
      calculatorLink,
      contactsLink,
      menu,
      body,
      mainButton,
    } = this.elements;

    if (!header || !productsLink || !calculatorLink || !contactsLink) return;

    // Делегирование событий для навигации
    header.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("header-products")) {
        productsLink.scrollIntoView({ behavior: "smooth" });
      } else if (target.classList.contains("header-amount")) {
        calculatorLink.scrollIntoView({ behavior: "smooth" });
      } else if (target.classList.contains("header-contacts")) {
        contactsLink.scrollIntoView({ behavior: "smooth" });
      }
    });

    // Бургер-меню
    document.querySelector(".header-burger")?.addEventListener("click", () => {
      menu?.classList.add("header-open");
      body.style.overflow = "hidden";
    });

    // Закрытие меню
    document.querySelectorAll("#menu *").forEach((item) => {
      item.addEventListener("click", () => {
        menu?.classList.remove("header-open");
        body.style.overflow = "visible";
      });
    });

    // Главная кнопка
    mainButton?.addEventListener("click", () => {
      productsLink.scrollIntoView({ behavior: "smooth" });
    });
  },

  // Настройка раздела продуктов
  setupProducts() {
    const productsButtons = document.querySelectorAll(".product-btn");
    const calculator = this.elements.calculatorLink;
    const moreButtons = document.querySelectorAll(".product-more-button");

    if (!productsButtons.length || !calculator) return;

    // Обработка кнопок продуктов
    productsButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productInfo = button.parentElement;
        const productTitle =
          productInfo.querySelector(".product-title")?.textContent;
        const currentText = this.elements.selectCurrent;

        if (productTitle && currentText) {
          calculator.scrollIntoView({ behavior: "smooth" });
          currentText.textContent = productTitle;
        }
      });
    });

    // Обработка кнопок "Подробнее"
    moreButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const product = e.target.closest(".product");
        if (!product) return;

        const productImage = product.querySelector(".product-image");
        const productInfo = product.querySelector(".product-info");
        const buttonClose = product.querySelector(".product-more-close");
        const addText = product.querySelectorAll(".add-text");

        productImage?.classList.remove("is-active");
        if (productInfo) {
          addText.forEach((text) => {
            text.style.display = "block";
          })
        }
        e.target.style.display = "none";
        buttonClose?.classList.add("is-active");

        // Обработчик закрытия
        buttonClose?.addEventListener("click", () => {
          buttonClose.classList.remove("is-active");
          productImage?.classList.add("is-active");
          if (productInfo) {
            addText.forEach((text) => {
            text.style.display = "none";
          })
          }
          e.target.style.display = "block";
        });
      });
    });
  },

  // Настройка калькулятора
  setupCalculator() {
    this.initCustomSelect();
    this.setupRange();
    this.setupOrderCall();

    // Обновление цены при изменении доставки
    this.elements.deliveryCheckbox?.addEventListener("change", () =>
      this.updateTotalPrice()
    );
    this.updateTotalPrice(); // Инициализация начальной цены
  },

  // Кастомный селект
  initCustomSelect() {
    const { select, selectHeader, selectIcon, selectCurrent } = this.elements;
    if (!select || !selectHeader || !selectIcon || !selectCurrent) return;

    const selectItems = select.querySelectorAll(".select-item");
    let isSelectOpen = false;

    const toggleSelect = (open) => {
      isSelectOpen = open !== undefined ? open : !isSelectOpen;
      select.classList.toggle("is-active", isSelectOpen);
      selectIcon.style.transform = isSelectOpen
        ? "rotate(180deg)"
        : "rotate(0)";

      if (isSelectOpen) {
        select.style.borderBottomRightRadius = "0";
        select.style.borderBottomLeftRadius = "0";
      } else {
        select.style.borderBottomRightRadius = "15px";
        select.style.borderBottomLeftRadius = "15px";
      }
    };

    // Обработчики событий
    selectHeader.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleSelect();
    });

    selectItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        selectCurrent.textContent = item.textContent;
        toggleSelect(false);
        this.updateTotalPrice();
      });
    });

    // Закрытие при клике вне селекта
    document.addEventListener("click", (e) => {
      if (!select.contains(e.target)) toggleSelect(false);
    });

    // Обработка клавиатуры
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isSelectOpen) toggleSelect(false);
    });

    // Защита от потери фокуса
    select.addEventListener("mousedown", (e) => e.preventDefault());
  },

  // Настройка диапазона
  setupRange() {
    const { range, hoursOut } = this.elements;
    if (!range || !hoursOut) return;

    const updateValues = (value) => {
      range.value = value;
      hoursOut.value = value;
      this.updateTotalPrice();
    };

    range.addEventListener("input", (e) => updateValues(e.target.value));
    hoursOut.addEventListener("input", (e) => updateValues(e.target.value));
  },

  // Обновление общей цены
  updateTotalPrice() {
    const { hoursOut, totalPriceElement, deliveryCheckbox, selectCurrent } =
      this.elements;
    if (!hoursOut || !totalPriceElement || !deliveryCheckbox) return;

    const BASE_PRICE = 2000;
    const DELIVERY_PRICE = 5000;
    const TAX_MULTIPLIER = 1.2;

    const hoursValue = parseInt(hoursOut.value) || 0;
    let amount = BASE_PRICE * hoursValue;

    // Учитываем выбранный продукт (если не дефолтный)
    if (selectCurrent && selectCurrent.textContent !== "Выберите модель") {
      // Здесь можно добавить логику для разных цен продуктов
    }

    if (deliveryCheckbox.checked) amount += DELIVERY_PRICE;

    const formatter = new Intl.NumberFormat("ru");
    totalPriceElement.textContent = formatter.format(amount * TAX_MULTIPLIER);
  },

  // Настройка заказа звонка
  setupOrderCall() {
    const {
      calculatorButton,
      popup,
      popupClose,
      body,
      overlay,
      popupForm,
      selectCurrent,
    } = this.elements;
    if (!popup || !popupClose || !overlay) return;

    const popupProducts = document.querySelectorAll(".popup-product");

    popupClose.addEventListener("click", () => {
      popup.classList.remove("is-active");
      body.style.overflow = "visible";
      overlay.style.display = "none";
      popupForm?.reset();
      this.elements.formSuccess.textContent = "";
    });

    calculatorButton?.addEventListener("click", () => {
      popup.classList.add("is-active");
      body.style.overflow = "hidden";
      overlay.style.display = "block";

      popupProducts.forEach((product) => {
        product.textContent =
          selectCurrent.textContent !== "Выберите модель"
            ? selectCurrent.textContent
            : "";
      });
    });
  },

  // Валидация попапа
  setupPopupValidation() {
    const { popupForm, loading } = this.elements;
    if (!popupForm) return;

    const number = $("#number");
    const name = $("#name");

    // Маска для телефона
    if (number) {
      number.inputmask("+7 999 999 9999");
      const rawPhone = number.val().replace(/\D/g, "");
    }

    // Запрет цифр в имени
    name[0].onkeydown = (e) => {
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    // Обработка отправки формы
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(popupForm);
      const name = formData.get("name").trim();
      const number = formData.get("number").trim();
      let isValid = true;

      // Валидация
      if (!name) {
        document.getElementById("nameError").textContent = "Введите имя";
        isValid = false;
      } else {
        document.getElementById("nameError").textContent = "";
      }

      if (!number || number.replace(/\D/g, "").length < 11) {
        document.getElementById("numberError").textContent =
          "Введите корректный номер телефона";
        isValid = false;
      } else {
        document.getElementById("numberError").textContent = "";
      }

      if (!isValid) return;

      // Показываем индикатор загрузки
      if (loading) loading.style.display = "flex";

      // Отправка данных через AJAX
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "sendmail.php", true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            popupForm.reset();
            formSuccess.textContent = "Заявка успешно отправлена!";
            if (loading) loading.style.display = "none";
          } else {
            // Выводим ошибки сервера
            if (response.errors) {
              for (const field in response.errors) {
                document.getElementById(field + "Error").textContent =
                  response.errors[field];
              }
            } else {
              formSuccess.textContent =
                "Произошла ошибка при отправке: " + response.message;
            }
          }
        } else {
          formSuccess.textContent = "Произошла ошибка при отправке запроса";
          if (loading) loading.style.display = "none";
        }
      };

      xhr.send(formData);
    });
  },
};

// Запуск приложения после загрузки DOM
document.addEventListener("DOMContentLoaded", () => App.init());
