def yellow(s):
  return "\033[33m" + str(s) + "\033[0m"
def green(s):
  return "\033[1m\033[32m" + str(s) + "\033[0m"


def drawTree(node, prefix="", isLeft=True):
  if not node:
    print("Empty Tree")
    return

  if node.r:
    if prefix:
      drawTree(node.r, prefix + yellow("│   " if isLeft else "    "), False)
    else:
      drawTree(node.r, prefix + "    ", False)

  if prefix:
    print(prefix + yellow("└── " if isLeft else "┌── ") + green(node.val))
  else:
    print(prefix + yellow(" 🌳 " if isLeft else "┌── ") + green(node.val))

  if node.l:
    drawTree(node.l, prefix + yellow("    " if isLeft else "│   "), True)