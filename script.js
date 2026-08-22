/* ==========================================
   D88 EVALUATION FRAMEWORK — V2
   STORAGE + WEBSITE ANALYSIS + SCORING
========================================== */

const STORAGE_KEY = "d88_businesses";


/* ==========================================
   SCORE CATEGORIES
========================================== */

const WEBSITE_CATEGORIES = [
    {
        id: "performance",
        name: "Performance",
        weight: 15,
        description: "Loading speed and overall technical performance."
    },
    {
        id: "mobile",
        name: "Mobile Responsiveness",
        weight: 15,
        description: "How well the website works on phones and tablets."
    },
    {
        id: "cta",
        name: "Conversion / CTA",
        weight: 15,
        description: "How clearly the website guides visitors toward action."
    },
    {
        id: "ux",
        name: "Navigation / UX",
        weight: 10,
        description: "Ease of navigation and overall user experience."
    },
    {
        id: "content",
        name: "Content / Messaging",
        weight: 10,
        description: "Clarity, usefulness, and quality of the website's information."
    },
    {
        id: "seo",
        name: "SEO / Discoverability",
        weight: 10,
        description: "Search visibility and basic search-engine optimization."
    },
    {
        id: "design",
        name: "Visual Design / Trust",
        weight: 15,
        description: "Visual quality, professionalism, credibility, and trust."
    },
    {
        id: "accessibility",
        name: "Accessibility / Technical Quality",
        weight: 10,
        description: "Accessibility and basic technical implementation."
    }
];


const OPPORTUNITY_CATEGORIES = [
    {
        id: "problemSeverity",
        name: "Problem Severity",
        weight: 30,
        description: "How significant the website's problems are."
    },
    {
        id: "businessImpact",
        name: "Business Impact",
        weight: 25,
        description: "Potential impact of improving the website on the business."
    },
    {
        id: "marketPotential",
        name: "Business / Market Potential",
        weight: 20,
        description: "Potential value and growth opportunity of the business."
    },
    {
        id: "improvementPotential",
        name: "D88 Improvement Potential",
        weight: 15,
        description: "How much D88 could realistically improve the website."
    },
    {
        id: "outreachPotential",
        name: "Outreach / Qualification Potential",
        weight: 10,
        description: "How promising the business is as an outreach prospect."
    }
];


/* ==========================================
   URL HELPERS
========================================== */

function normalizeURL(value) {

    let url = value.trim();

    if (!url) {
        return "";
    }

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    return url;
}


function getDomain(url) {

    try {

        return new URL(normalizeURL(url)).hostname.replace(/^www\./, "");

    } catch (error) {

        return "";

    }
}


/* ==========================================
   WEBSITE PREVIEW
========================================== */

function getFaviconURL(url) {

    const domain = getDomain(url);

    if (!domain) {
        return "";
    }

    /*
       Google's favicon service allows the GitHub Pages
       frontend to display a site's favicon without trying
       to fetch the entire website from JavaScript.
    */

    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}


function showWebsitePreview() {

    const websiteInput = document.getElementById("website");
    const preview = document.getElementById("websitePreview");

    if (!websiteInput || !preview) {
        return;
    }

    const url = normalizeURL(websiteInput.value);

    if (!url) {

        preview.innerHTML = "";
        preview.style.display = "none";

        return;
    }

    const domain = getDomain(url);
    const favicon = getFaviconURL(url);

    preview.innerHTML = `

        <div class="website-preview-card">

            <img
                src="${escapeHTML(favicon)}"
                class="website-favicon"
                alt=""
                onerror="this.style.display='none'"
            >

            <div class="website-preview-information">

                <strong>WEBSITE DETECTED</strong>

                <span>
                    ${escapeHTML(domain || url)}
                </span>

            </div>

        </div>

    `;

    preview.style.display = "block";
}


/* ==========================================
   SCORE CALCULATION
========================================== */

function calculateWeightedScore(categories) {

    let total = 0;

    categories.forEach(function(category) {

        const input = document.getElementById(category.id);

        if (!input) {
            return;
        }

        const value = Number(input.value) || 0;

        total += value * (category.weight / 100);

    });

    return Math.round(total);
}


/* ==========================================
   PRIORITY
========================================== */

function getPriority(opportunityScore) {

    if (opportunityScore >= 70) {
        return "High";
    }

    if (opportunityScore >= 40) {
        return "Medium";
    }

    return "Low";
}


/* ==========================================
   CREATE SCORE INPUTS
========================================== */

function createScoreInputs(containerID, categories) {

    const container = document.getElementById(containerID);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    categories.forEach(function(category) {

        const wrapper = document.createElement("div");

        wrapper.className = "score-category";

        wrapper.innerHTML = `

            <div class="score-category-header">

                <div>

                    <strong>
                        ${escapeHTML(category.name)}
                    </strong>

                    <span class="score-description">
                        ${escapeHTML(category.description)}
                    </span>

                </div>

                <span class="score-weight">
                    ${category.weight}%
                </span>

            </div>

            <div class="score-control">

                <input
                    type="range"
                    id="${category.id}"
                    min="0"
                    max="100"
                    value="50"
                    oninput="updateScores()"
                >

                <span
                    id="${category.id}Value"
                    class="score-value"
                >
                    50
                </span>

            </div>

        `;

        container.appendChild(wrapper);

    });
}


/* ==========================================
   UPDATE SCORES
========================================== */

function updateScores() {

    WEBSITE_CATEGORIES.forEach(function(category) {

        const input = document.getElementById(category.id);
        const value = document.getElementById(category.id + "Value");

        if (input && value) {
            value.textContent = input.value;
        }

    });


    OPPORTUNITY_CATEGORIES.forEach(function(category) {

        const input = document.getElementById(category.id);
        const value = document.getElementById(category.id + "Value");

        if (input && value) {
            value.textContent = input.value;
        }

    });


    const websiteScore =
        calculateWeightedScore(WEBSITE_CATEGORIES);

    const opportunityScore =
        calculateWeightedScore(OPPORTUNITY_CATEGORIES);


    const websiteDisplay =
        document.getElementById("websiteScore");

    const opportunityDisplay =
        document.getElementById("opportunityScore");

    const priorityDisplay =
        document.getElementById("priority");


    if (websiteDisplay) {
        websiteDisplay.textContent = websiteScore + "/100";
    }

    if (opportunityDisplay) {
        opportunityDisplay.textContent =
            opportunityScore + "/100";
    }

    if (priorityDisplay) {

        priorityDisplay.textContent =
            getPriority(opportunityScore).toUpperCase();

    }

}


/* ==========================================
   ANALYZE / SAVE WEBSITE
========================================== */

function analyze() {

    const businessInput =
        document.getElementById("business");

    const websiteInput =
        document.getElementById("website");


    if (!businessInput || !websiteInput) {
        return;
    }


    const businessName =
        businessInput.value.trim();

    const website =
        normalizeURL(websiteInput.value);


    if (businessName === "" || website === "") {

        alert(
            "Please enter a business name and website URL."
        );

        return;
    }


    /*
       Calculate both independent scores.
    */

    const websiteScore =
        calculateWeightedScore(
            WEBSITE_CATEGORIES
        );

    const opportunityScore =
        calculateWeightedScore(
            OPPORTUNITY_CATEGORIES
        );


    const priority =
        getPriority(opportunityScore);


    const testedAt =
        new Date().toISOString();


    /*
       Save individual category scores as well.
       This means the evaluation can be displayed
       or recalculated later.
    */

    const websiteScores = {};

    WEBSITE_CATEGORIES.forEach(function(category) {

        const input =
            document.getElementById(category.id);

        websiteScores[category.id] =
            input ? Number(input.value) : 0;

    });


    const opportunityScores = {};

    OPPORTUNITY_CATEGORIES.forEach(function(category) {

        const input =
            document.getElementById(category.id);

        opportunityScores[category.id] =
            input ? Number(input.value) : 0;

    });


    const business = {

        id: Date.now(),

        name: businessName,

        website: website,

        domain: getDomain(website),

        favicon: getFaviconURL(website),

        websiteScore: websiteScore,

        opportunityScore: opportunityScore,

        /*
           Keep "score" for compatibility with
           older V1 saved businesses.
        */

        score: opportunityScore,

        priority: priority,

        websiteScores: websiteScores,

        opportunityScores: opportunityScores,

        testedAt: testedAt,

        version: 2

    };


    let businesses =
        getBusinesses();


    businesses.push(business);


    saveBusinesses(businesses);


    const result =
        document.getElementById("result");


    if (result) {

        result.innerHTML = `

            <div class="result-box">

                <h2>
                    EVALUATION COMPLETE
                </h2>

                <div class="result-scores">

                    <div>
                        <span>WEBSITE SCORE</span>
                        <strong>
                            ${websiteScore}/100
                        </strong>
                    </div>

                    <div>
                        <span>OPPORTUNITY SCORE</span>
                        <strong>
                            ${opportunityScore}/100
                        </strong>
                    </div>

                    <div>
                        <span>PRIORITY</span>
                        <strong>
                            ${priority.toUpperCase()}
                        </strong>
                    </div>

                </div>

                <p>
                    ${escapeHTML(businessName)}
                    has been saved.
                </p>

                <p>

                    <a href="businesses.html">
                        VIEW ALL BUSINESSES →
                    </a>

                </p>

            </div>

        `;

    }

}


/* ==========================================
   GET BUSINESSES
========================================== */

function getBusinesses() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    if (!savedData) {
        return [];
    }


    try {

        const businesses =
            JSON.parse(savedData);


        if (Array.isArray(businesses)) {
            return businesses;
        }

    } catch (error) {

        console.error(
            "Could not read saved businesses:",
            error
        );

    }


    return [];

}


/* ==========================================
   SAVE BUSINESSES
========================================== */

function saveBusinesses(businesses) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(businesses)
    );

}


/* ==========================================
   PRIORITY RANKING
========================================== */

function getPriorityRank(priority) {

    /*
       toUpperCase() fixes the common problem where
       "High", "HIGH", and "high" were treated differently.
    */

    const normalized =
        String(priority || "")
            .trim()
            .toUpperCase();


    const priorityValues = {

        HIGH: 3,

        MEDIUM: 2,

        LOW: 1

    };


    return priorityValues[normalized] || 0;

}


/* ==========================================
   DISPLAY BUSINESSES
========================================== */

function displayBusinesses() {

    const businessList =
        document.getElementById("businessList");


    if (!businessList) {
        return;
    }


    let businesses =
        getBusinesses();


    const sortElement =
        document.getElementById("sort");


    const sortOption =
        sortElement
            ? sortElement.value
            : "priority";


    /* ======================================
       PRIORITY: HIGH → LOW
    ====================================== */

    if (sortOption === "priority") {

        businesses.sort(function(a, b) {

            const priorityDifference =
                getPriorityRank(b.priority) -
                getPriorityRank(a.priority);


            /*
               If two businesses have the same
               priority, newest comes first.
            */

            if (priorityDifference === 0) {

                return (
                    new Date(b.testedAt) -
                    new Date(a.testedAt)
                );

            }


            return priorityDifference;

        });

    }


    /* ======================================
       MOST RECENTLY TESTED
    ====================================== */

    else if (sortOption === "recent") {

        businesses.sort(function(a, b) {

            return (
                new Date(b.testedAt) -
                new Date(a.testedAt)
            );

        });

    }


    /* ======================================
       NOTHING SAVED
    ====================================== */

    if (businesses.length === 0) {

        businessList.innerHTML = `

            <div class="business-card">

                <h2>NO BUSINESSES FOUND</h2>

                <p>
                    Test a website to add a business
                    to the database.
                </p>

            </div>

        `;

        return;

    }


    businessList.innerHTML = "";


    /* ======================================
       CREATE BUSINESS CARDS
    ====================================== */

    businesses.forEach(function(business) {

        const date =
            new Date(
                business.testedAt
            ).toLocaleString();


        const websiteScore =
            business.websiteScore !== undefined
                ? business.websiteScore
                : business.score;


        const opportunityScore =
            business.opportunityScore !== undefined
                ? business.opportunityScore
                : business.score;


        const favicon =
            business.favicon ||
            getFaviconURL(business.website);


        const card =
            document.createElement("div");


        card.className =
            "business-card";


        card.innerHTML = `

            <div class="business-header">

                ${
                    favicon
                        ? `
                            <img
                                src="${escapeHTML(favicon)}"
                                class="business-favicon"
                                alt=""
                                onerror="this.style.display='none'"
                            >
                          `
                        : ""
                }

                <div>

                    <h2>
                        ${escapeHTML(business.name)}
                    </h2>

                    <p>

                        <a
                            href="${escapeHTML(business.website)}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escapeHTML(
                                business.domain ||
                                business.website
                            )}
                        </a>

                    </p>

                </div>

            </div>


            <div class="business-scores">

                <div>

                    <span>
                        WEBSITE
                    </span>

                    <strong>
                        ${websiteScore}/100
                    </strong>

                </div>


                <div>

                    <span>
                        OPPORTUNITY
                    </span>

                    <strong>
                        ${opportunityScore}/100
                    </strong>

                </div>


                <div>

                    <span>
                        PRIORITY
                    </span>

                    <strong>
                        ${escapeHTML(
                            String(
                                business.priority || "N/A"
                            ).toUpperCase()
                        )}
                    </strong>

                </div>

            </div>


            <p>

                <strong>
                    TESTED:
                </strong>

                ${escapeHTML(date)}

            </p>


            <button
                class="delete-button"
                onclick="deleteBusiness(${Number(business.id)})"
            >
                DELETE
            </button>

        `;


        businessList.appendChild(card);

    });

}


/* ==========================================
   DELETE BUSINESS
========================================== */

function deleteBusiness(id) {

    let businesses =
        getBusinesses();


    businesses =
        businesses.filter(function(business) {

            return Number(business.id) !== Number(id);

        });


    saveBusinesses(businesses);


    displayBusinesses();

}


/* ==========================================
   HTML ESCAPING
========================================== */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
           Build scoring controls when the tester
           page is opened.
        */

        createScoreInputs(
            "websiteScoreInputs",
            WEBSITE_CATEGORIES
        );


        createScoreInputs(
            "opportunityScoreInputs",
            OPPORTUNITY_CATEGORIES
        );


        updateScores();


        /*
           URL preview.
        */

        const websiteInput =
            document.getElementById("website");


        if (websiteInput) {

            websiteInput.addEventListener(
                "input",
                showWebsitePreview
            );

        }


        /*
           Saved businesses page.
        */

        displayBusinesses();

    }
);
