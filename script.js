// =============================
// CONSTANTES E SELETORES
// =============================
const sections = document.querySelectorAll(".gs-section");
const images = document.querySelectorAll(".gs-bg");
const headings = gsap.utils.toArray(".gs-heading");
const outerWrappers = gsap.utils.toArray(".gs-outer");
const innerWrappers = gsap.utils.toArray(".gs-inner");

const splitHeadings = headings.map((heading) => 
    new SplitText(heading, {
        type: "chars,words,lines",
        linesClass: "gs-clip"
    })
);

let currentIndex = -1;
let animating = false;
const wrap = gsap.utils.wrap(0, sections.length);


// =============================
// ESTADOS INICIAIS
// =============================
gsap.set(outerWrappers, { yPercent: 100 });
gsap.set(innerWrappers, { yPercent: -100 });

sections.forEach(sec => gsap.set(sec, { autoAlpha: 0 }));
gsap.set(sections[0], { autoAlpha: 1 });


// =============================
// FUNÇÃO PRINCIPAL DE TROCA
// =============================
function gotoSection(index, direction) {
    index = wrap(index);
    animating = true;

    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;

    const tl = gsap.timeline({
        defaults: { duration: 1.2, ease: "power2.out" },
        onComplete: () => (animating = false)
    });

    if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
        .set(sections[currentIndex], { autoAlpha: 0 });
    }

    gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

    tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
    )
    .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
    .fromTo(
        splitHeadings[index].chars,
        { autoAlpha: 0, yPercent: 150 * dFactor },
        {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: { each: 0.015, from: "random" }
        },
        0.15
    );

    currentIndex = index;

    // QUANDO CHEGAR NA ÚLTIMA SECTION → libera scroll normal
    if (index === sections.length - 1) {
        setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 800);
    }
}


// =============================
// OBSERVER — CONTROLE DO SCROLL
// =============================
Observer.create({
    type: "wheel,touch,pointer",
    preventDefault: true,
    wheelSpeed: -0.9,

    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    tolerance: 12
});


// =============================
// INICIALIZAÇÃO
// =============================
gotoSection(0, 1);