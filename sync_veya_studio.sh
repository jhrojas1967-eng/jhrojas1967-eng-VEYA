#!/usr/bin/env bash
# ==============================================================================
# Script: sync_veya_studio.sh
# Descripción: Automatiza el copiado de tokens de diseño, especificaciones de
#              avatar Lottie y guías de integración hacia el repositorio de
#              desarrollo de Claude / Android, creando la rama 'feature/design-system-sync'.
# ==============================================================================

set -euo pipefail

# Colores para salida en terminal
COLOR_RESET="\033[0m"
COLOR_BOLD="\033[1m"
COLOR_GREEN="\033[32m"
COLOR_BLUE="\033[34m"
COLOR_YELLOW="\033[33m"
COLOR_RED="\033[31m"

BRANCH_NAME="feature/design-system-sync"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${COLOR_BOLD}${COLOR_BLUE}=== VEYA Studio -> Sincronizador de Sistema de Diseño y Avatar ===${COLOR_RESET}"
echo ""

# Validar argumento de ruta destino
TARGET_REPO="${1:-}"

if [[ -z "$TARGET_REPO" ]]; then
    echo -e "${COLOR_YELLOW}Uso: ./sync_veya_studio.sh <ruta-al-repositorio-de-claude>${COLOR_RESET}"
    echo -e "Ejemplo: ./sync_veya_studio.sh ../veya-android"
    echo ""
    read -rp "Introduce la ruta al repositorio de destino de Claude: " TARGET_REPO
fi

# Verificar existencia del directorio destino
if [[ ! -d "$TARGET_REPO" ]]; then
    echo -e "${COLOR_RED}Error: El directorio destino '$TARGET_REPO' no existe.${COLOR_RESET}"
    exit 1
fi

# Convertir a ruta absoluta
TARGET_REPO="$(cd "$TARGET_REPO" && pwd)"

# Verificar que el destino sea un repositorio Git
if [[ ! -d "$TARGET_REPO/.git" ]]; then
    echo -e "${COLOR_RED}Error: '$TARGET_REPO' no es un repositorio Git válido (.git no encontrado).${COLOR_RESET}"
    exit 1
fi

echo -e "${COLOR_GREEN}✓ Repositorio destino detectado:${COLOR_RESET} $TARGET_REPO"

# Navegar al repositorio de destino y preparar la rama Git
cd "$TARGET_REPO"

echo -e "${COLOR_BLUE}→ Preparando rama Git: ${COLOR_BOLD}$BRANCH_NAME${COLOR_RESET}"

# Comprobar si hay cambios sin confirmar en el repo destino
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    echo -e "${COLOR_YELLOW}Aviso: Existen cambios no confirmados en el repositorio destino.${COLOR_RESET}"
    echo -e "Se recomienda hacer stash o commit antes de continuar."
    read -rp "¿Deseas continuar de todos modos? (s/N): " CONFIRM
    if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
        echo "Operación cancelada."
        exit 0
    fi
fi

# Crear o cambiar a la rama feature/design-system-sync
if git show-ref --quiet --heads "$BRANCH_NAME"; then
    echo -e "Cambiando a la rama existente '${COLOR_BOLD}$BRANCH_NAME${COLOR_RESET}'..."
    git checkout "$BRANCH_NAME"
else
    echo -e "Creando y cambiando a la nueva rama '${COLOR_BOLD}$BRANCH_NAME${COLOR_RESET}'..."
    git checkout -b "$BRANCH_NAME"
fi

# Crear estructura de carpetas en el repositorio destino
echo -e "${COLOR_BLUE}→ Creando carpetas de destino en el repositorio...${COLOR_RESET}"
DEST_DOCS="$TARGET_REPO/docs/design-system"
DEST_ENTREGAS="$TARGET_REPO/docs/entregas"
DEST_RAW="$TARGET_REPO/app/src/main/res/raw"

mkdir -p "$DEST_DOCS"
mkdir -p "$DEST_ENTREGAS"
mkdir -p "$DEST_RAW"

# Copiar archivos clave desde VEYA Studio
echo -e "${COLOR_BLUE}→ Copiando archivos de configuración, tokens y guías...${COLOR_RESET}"

# 1. Configuración Canónica Lottie
if [[ -f "$SCRIPT_DIR/LottieExportConfig.json" ]]; then
    cp "$SCRIPT_DIR/LottieExportConfig.json" "$DEST_DOCS/LottieExportConfig.json"
    cp "$SCRIPT_DIR/LottieExportConfig.json" "$TARGET_REPO/LottieExportConfig.json" 2>/dev/null || true
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} LottieExportConfig.json -> docs/design-system/"
fi

# 2. Guías de entrega y Handover en Markdown
if [[ -d "$SCRIPT_DIR/entregas" ]]; then
    cp -r "$SCRIPT_DIR/entregas/"* "$DEST_ENTREGAS/"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} entregas/*.md -> docs/entregas/"
fi

# 3. Tokens TypeScript de referencia
if [[ -f "$SCRIPT_DIR/src/themeTokens.ts" ]]; then
    cp "$SCRIPT_DIR/src/themeTokens.ts" "$DEST_DOCS/themeTokens.ts"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} src/themeTokens.ts -> docs/design-system/"
fi

# 4. Configuración de Lottie TypeScript de referencia
if [[ -f "$SCRIPT_DIR/src/lottieConfig.ts" ]]; then
    cp "$SCRIPT_DIR/src/lottieConfig.ts" "$DEST_DOCS/lottieConfig.ts"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} src/lottieConfig.ts -> docs/design-system/"
fi

# Preparar y hacer commit en Git
echo -e "${COLOR_BLUE}→ Registrando cambios en Git...${COLOR_RESET}"
git add "$DEST_DOCS" "$DEST_ENTREGAS"

if [[ -f "$TARGET_REPO/LottieExportConfig.json" ]]; then
    git add "$TARGET_REPO/LottieExportConfig.json"
fi

# Realizar el commit si hay diferencias
if git diff --cached --quiet; then
    echo -e "${COLOR_YELLOW}No se detectaron diferencias nuevas para confirmar.${COLOR_RESET}"
else
    COMMIT_MSG="feat(design-system): sync VEYA tokens, avatar Lottie configuration and Compose guides"
    git commit -m "$COMMIT_MSG"
    echo -e "${COLOR_GREEN}✓ Commit realizado con éxito en '$BRANCH_NAME':${COLOR_RESET}"
    echo -e "  \"$COMMIT_MSG\""
fi

echo ""
echo -e "${COLOR_BOLD}${COLOR_GREEN}=== ¡Sincronización completada con éxito! ===${COLOR_RESET}"
echo ""
echo -e "Archivos disponibles para Claude en el repositorio:"
echo -e "  1. ${COLOR_BOLD}docs/design-system/LottieExportConfig.json${COLOR_RESET} (Capas, 60fps, anclajes y KeyPaths)"
echo -e "  2. ${COLOR_BOLD}docs/entregas/01_tokens_y_avatar_para_claude.md${COLOR_RESET} (Tokens M3 y paletas)"
echo -e "  3. ${COLOR_BOLD}docs/entregas/02_guia_integracion_lottie_compose.md${COLOR_RESET} (Código Composable y Gradle)"
echo -e "  4. ${COLOR_BOLD}docs/entregas/03_handover_para_claude_rutas_y_descripcion.md${COLOR_RESET} (Instrucciones de prompt)"
echo ""
echo -e "Para continuar con Claude Code en el repositorio destino, ejecuta:"
echo -e "  ${COLOR_BOLD}cd $TARGET_REPO && git status${COLOR_RESET}"
