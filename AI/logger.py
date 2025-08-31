import logging

# Create a logger
logger = logging.getLogger("chatbot_logger")
logger.setLevel(logging.DEBUG)  # Capture all levels DEBUG -> CRITICAL

# Console handler
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)  # Print all levels to terminal

# Formatter
formatter = logging.Formatter(
    "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    "%Y-%m-%d %H:%M:%S"
)
console_handler.setFormatter(formatter)

# Add handler
logger.addHandler(console_handler)
