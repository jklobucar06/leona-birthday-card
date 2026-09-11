type Polaroid = {
    src: string;
    number: string;
    title: string;
};

export const polaroids: Polaroid[] = [
    {
        src: `${import.meta.env.BASE_URL}gallery/vodice_vecera.jpeg`,
        number: "#01",
        title: "Jedna za Snješku",
    },
    {
        src: `${import.meta.env.BASE_URL}gallery/vodice_poljubac.jpeg`,
        number: "#02",
        title: "😘🤗🥰",
    },
    {
        src: `${import.meta.env.BASE_URL}gallery/svezanj.jpeg`,
        number: "#03",
        title: "Mame s Facebooka",
    },
    {
        src: `${import.meta.env.BASE_URL}gallery/vodice_zagrljaj_plaza.jpeg`,
        number: "#04",
        title: "Cuties Patooties",
    },
    {
        src: `${import.meta.env.BASE_URL}gallery/biceps.jpeg`,
        number: "#05",
        title: "Suptilni Biceps 💪",
    },
    {
        src: `${import.meta.env.BASE_URL}gallery/loli_sgoofy.jpeg`,
        number: "#06",
        title: "vtf nmg iskr",
    }
]
