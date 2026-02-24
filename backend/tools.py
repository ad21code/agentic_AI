from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Use this tool to perform mathematical calculations."""
    try:
        return str(eval(expression))
    except Exception:
        return "Invalid calculation"
