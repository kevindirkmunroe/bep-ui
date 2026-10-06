from playwright.async_api import async_playwright

_playwright = None
_browser = None
_page = None


async def start_browser():
    global _playwright, _browser, _page

    print("Starting Playwright...")

    _playwright = await async_playwright().start()

    print("Launching Chromium...")

    _browser = await _playwright.chromium.launch(
        headless=False
    )

    _page = await _browser.new_page()

    print("Opening FakeCheap...")

    await _page.goto(
        "http://localhost:8000/fakecheapsf-original.htm"
    )

    print("FakeCheap loaded:", await _page.title())

async def inspect_form() -> str:
    print("TOOL: inspect_form called")

    controls = await _page.locator(
        "input:not([type=hidden]), textarea, select"
    ).evaluate_all("""
        elements => elements
            .filter(el => {
                const style = window.getComputedStyle(el);

                return style.display !== "none" &&
                       style.visibility !== "hidden";
            })
            .map(el => {
                const label =
                    el.id
                        ? document.querySelector(
                            `label[for="${el.id}"]`
                          )?.innerText
                        : null;

                return {
                    tag: el.tagName,
                    type: el.type || null,
                    id: el.id || null,
                    name: el.name || null,
                    label: label || null,
                    placeholder: el.placeholder || null,
                    options:
                        el.tagName === "SELECT"
                            ? Array.from(el.options).map(o => ({
                                text: o.text,
                                value: o.value
                            }))
                            : null
                };
            })
    """)

    return str(controls)


async def fill_field(selector: str, value: str) -> str:
    """
    Fill a text field identified by a CSS selector.
    """
    print("TOOL: fill_fields called")

    try:
        await _page.locator(selector).fill(value)
        return f"Filled {selector} with {value}"
    except Exception as e:
        return f"Unable to fill {selector}: {e}"


async def fill_fields(fields: dict) -> str:
    results = []

    for selector, value in fields.items():
        try:
            await _page.locator(selector).fill(value)
            results.append(f"Filled {selector}")
        except Exception as e:
            results.append(f"Failed {selector}: {e}")

    return "\n".join(results)


async def select_option(selector: str, value: str) -> str:
    """
    Select an option from a select element.
    """

    try:
        await _page.locator(selector).select_option(
            value=value
        )

        return f"Selected {value} in {selector}"

    except Exception as e:
        return f"Unable to select {selector}: {e}"


async def finish() -> str:
    """
    Signal that the form is ready for human review.

    Does NOT submit the form.
    """
    print("At Finish.")

    return "FORM_READY_FOR_HUMAN_REVIEW"
