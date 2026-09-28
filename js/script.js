$(function () {
    // فتح وإغلاق قائمة التنقل في الشاشات الصغيرة
    $("#menu-button").on("click", function () {
        $("#nav-links").toggleClass("open");
        $(this).attr("aria-expanded", $("#nav-links").hasClass("open"));
    });

    // Toast عند إضافة كتاب لقائمة القراءة
    $("[data-favorite]").on("click", function () {
        toastr.success("Book added to your reading list");
    });

    // فتح محتوى داخل Modal باستخدام Ajax
    function openAjaxModal(button, modalId, detailsId, url, message) {
        const details = $(detailsId);
        const modalElement = document.getElementById(modalId);

        if (!modalElement || !details.length) {
            return;
        }

        details.html("Loading...");
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
        toastr.info(message);

        $.ajax({
            url: url,
            method: "GET",
            dataType: "html"
        })
            .done(function (data) {
                details.html(data);
            })
            .fail(function () {
                details.html("<p>Unable to load the requested information.</p>");
            });
    }

    // Modal 1: تفاصيل الكتاب
    $("[data-book]").on("click", function () {
        const book = $(this).data("book");
        openAjaxModal(
            this,
            "bookModal",
            "#bookDetails",
            "../ajax/" + book + ".html",
            "Quick View opened successfully"
        );
    });

    // Modal 2: معلومات المكتبة
    $("[data-library]").on("click", function () {
        openAjaxModal(
            this,
            "libraryModal",
            "#libraryDetails",
            "../ajax/library.html",
            "Library information opened successfully"
        );
    });

    // عرض رسالة الخطأ أسفل الحقل
    function showError(input, message) {
        const error = $("#" + input.attr("id") + "-error");

        if (error.length) {
            error.text(message || "");
        }
    }

    // التحقق من صحة جميع حقول النموذج
    function validateForm(form) {
        let valid = true;

        $(form).find("input, textarea").each(function () {
            if (!this.checkValidity()) {
                showError($(this), this.validationMessage);
                valid = false;
            } else {
                showError($(this), "");
            }
        });

        const password = $(form).find("input[name='password']");
        const confirm = $(form).find("input[name='confirmPassword']");

        if (
            password.length &&
            confirm.length &&
            password.val() !== confirm.val()
        ) {
            showError(confirm, "Passwords do not match.");
            valid = false;
        }

        return valid;
    }

    // التحقق من تطابق كلمتي المرور أثناء الكتابة
    $("#register-form").on("input", function () {
        const password = $(this).find("input[name='password']")[0];
        const confirm = $(this).find("input[name='confirmPassword']")[0];

        if (password && confirm) {
            confirm.setCustomValidity(
                confirm.value && password.value !== confirm.value
                    ? "Passwords do not match."
                    : ""
            );
        }
    });

    // إرسال النماذج بعد التحقق من البيانات
    $("form").on("submit", function (event) {
        event.preventDefault();

        if (!validateForm(this)) {
            return;
        }

        if (this.id === "login-form") {
            window.location.href = "index.html";
            return;
        }

        toastr.success("Your information was submitted successfully");
        this.reset();
        $(this).find("[id$='-error']").text("");
    });
});
