window.onload = function () {
    var edutechloftBox = document.querySelectorAll('.edutechloft-box');
    var agmBox = document.querySelectorAll('.agm-box');


    //if edutechloft exists
    if (edutechloftBox.length > 0) {
        edutechloftBox.forEach(function (box) {
            box.addEventListener('mouseover', function () {
                edutechloftBox.forEach(function (box) {
                    box.classList.remove('active');
                });
                box.classList.add('active');
            });
        });
    }

    //if agmBox exists
    if (agmBox.length > 0) {
        agmBox.forEach(function (box) {
            box.addEventListener('mouseover', function () {
                agmBox.forEach(function (box) {
                    box.classList.remove('active');
                });
                box.classList.add('active');
            });
        });
    }


    /* Increase/descrease font size
        $('#increasetext').click(function(e) {
            e.preventDefault();
            curSize = parseInt($('.user_content').css('font-size')) + 2;
            if (curSize <= 32)
                $('.user_content').css('font-size', curSize);
        });

        $('#resettext').click(function(e) {
            e.preventDefault();
            if (curSize != 18)
                $('.user_content').css('font-size', 18);
        });

        $('#decreasetext').click(function(e) {
            e.preventDefault();
            curSize = parseInt($('.user_content').css('font-size')) - 2;
            if (curSize >= 14)
                $('.user_content').css('font-size', curSize);
        });

    */

        const headers = document.querySelectorAll(".edutechloft-home-2025 .accordion-header");

        headers.forEach(header => {
            header.addEventListener("click", function () {
                const currentItem = this.parentElement;
                const allItems = document.querySelectorAll(".edutechloft-home-2025 .accordion-item");

                allItems.forEach(item => {
                    if (item !== currentItem) {
                        item.classList.remove("active");
                    }
                });

                currentItem.classList.toggle("active");
            });
        });


    document.querySelectorAll('.edutechloft-home-2025 .nav-link').forEach(tab => {
        tab.addEventListener('click', function () {
            const parent = tab.closest('.edutechloft-home-2025');
            parent.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-tab-target');
            parent.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active', 'show');
            });

            const targetPane = parent.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add('active', 'show');
            }
        });
    });

// Acordeón
    document.querySelectorAll('.edutechloft-home-2025 .accordion-button').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = button.getAttribute('data-accordion-target');
            const target = document.querySelector(targetId);

            const expanded = button.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.edutechloft-home-2025 .accordion-collapse').forEach(p => {
                p.classList.remove('show');
            });
            document.querySelectorAll('.edutechloft-home-2025 .accordion-button').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
            });

            if (!expanded) {
                target.classList.add('show');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
    //accordeon

    const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

    accordionItemHeaders.forEach(accordionItemHeader => {
        accordionItemHeader.addEventListener("click", event => {

            // Uncomment in case you only want to allow for the display of only one collapsed item at a time!

//     const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
//     if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
//        currentlyActiveAccordionItemHeader.classList.toggle("active");
//        currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
//      }

            accordionItemHeader.classList.toggle("active");
            const accordionItemBody = accordionItemHeader.nextElementSibling;
            if (accordionItemHeader.classList.contains("active")) {
                accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
            } else {
                accordionItemBody.style.maxHeight = 0;
            }

        });
    });
    //accordeon

    window.onscroll = function () {
        myFunction()
    };

    function myFunction() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    }


    //glossary


            const tabs = document.querySelectorAll('.unab-tab');
            const tabContents = document.querySelectorAll('.unab-tab-content');

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(tc => tc.classList.add('hidden'));

                    tab.classList.add('active');
                    tabContents[index].classList.remove('hidden');
                });
            });

            tabs[0].click();


    };

    document.addEventListener("DOMContentLoaded", function () {
        const interval = setInterval(() => {
            const iframe = document.querySelector('iframe.tox-edit-area__iframe');
            if (iframe && iframe.contentDocument) {
                const head = iframe.contentDocument.head;

                if (!iframe.contentDocument.querySelector('#custom-editor-style')) {
                    const link = document.createElement("link");
                    link.id = "custom-editor-style";
                    link.rel = "stylesheet";
                    link.href = "https://instructure-uploads-pdx.s3.us-west-2.amazonaws.com/account_206310000000000001/attachments/69373/custom_style.css";
                    head.appendChild(link);
                    console.log("✅ Estilos personalizados cargados en el editor TinyMCE");
                }

                clearInterval(interval);
            }
        }, 500);
    });
// cintana acordeon
const headers = document.querySelectorAll(".cintana-2026 .accordion-header");

headers.forEach(header => {
    header.addEventListener("click", function () {
        const currentItem = this.parentElement;
        const allItems = document.querySelectorAll(".cintana-2026 .accordion-item");

        allItems.forEach(item => {
            if (item !== currentItem) {
                item.classList.remove("active");
            }
        });

        currentItem.classList.toggle("active");
    });
});
//accordeon

(function () {

    const allowedCourseIds = ['203'];

    function getCourseIdFromUrl() {
        const match = window.location.pathname.match(/\/courses\/(\d+)/);
        return match ? match[1] : null;
    }

    const currentCourseId = getCourseIdFromUrl();

    if (!allowedCourseIds.includes(currentCourseId)) {
        return;
    }

    // CSS externo
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://jacaro14.github.io/desgin-tool/unah-design-tools.css?v=6';
    document.head.appendChild(css);

    // JS externo
    const script = document.createElement('script');
    script.src = 'https://jacaro14.github.io/desgin-tool/unah-design-tools.js?v=6';
    script.defer = true;

    document.head.appendChild(script);

})();


