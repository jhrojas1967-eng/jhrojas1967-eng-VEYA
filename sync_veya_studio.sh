#!/usr/bin/env bash
# ==============================================================================
# Script: sync_veya_studio.sh
# Descripción: Automatiza la exportación del diseño de tokens y el AvatarLaboratory
#              desde este estudio hacia la rama y directorio 'feature/design-system-sync'
#              en el repositorio de VEYA, incluyendo la guía de despliegue para Claude Code.
# ==============================================================================

set -euo pipefail

# Colores de salida
COLOR_RESET="\033[0m"
COLOR_BOLD="\033[1m"
COLOR_GREEN="\033[32m"
COLOR_BLUE="\033[34m"
COLOR_CYAN="\033[36m"
COLOR_YELLOW="\033[33m"
COLOR_RED="\033[31m"

BRANCH_NAME="feature/design-system-sync"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${COLOR_BOLD}${COLOR_CYAN}====================================================================${COLOR_RESET}"
echo -e "${COLOR_BOLD}${COLOR_BLUE} VEYA Studio -> Exportador de Tokens & AvatarLaboratory a Claude Code${COLOR_RESET}"
echo -e "${COLOR_BOLD}${COLOR_CYAN}====================================================================${COLOR_RESET}"
echo ""

# 1. Resolver ruta del repositorio de destino
TARGET_PATH="${1:-}"

if [[ -z "$TARGET_PATH" ]]; then
    echo -e "${COLOR_YELLOW}Uso: ./sync_veya_studio.sh <ruta-al-repositorio-veya>${COLOR_RESET}"
    echo -e "Ejemplo: ./sync_veya_studio.sh ../veya-android"
    echo ""
    read -rp "Introduce la ruta al repositorio o directorio de VEYA: " TARGET_PATH
fi

# Validar existencia del destino
if [[ ! -d "$TARGET_PATH" ]]; then
    echo -e "${COLOR_YELLOW}El directorio '$TARGET_PATH' no existe. ¿Deseas crearlo ahora? (s/N): ${COLOR_RESET}"
    read -rp "" CREATE_DIR
    if [[ "$CREATE_DIR" =~ ^[sS]$ ]]; then
        mkdir -p "$TARGET_PATH"
    else
        echo -e "${COLOR_RED}Operación cancelada: Directorio no encontrado.${COLOR_RESET}"
        exit 1
    fi
fi

TARGET_PATH="$(cd "$TARGET_PATH" && pwd)"
echo -e "${COLOR_GREEN}✓ Directorio de destino:${COLOR_RESET} $TARGET_PATH"

IS_GIT_REPO=false
if [[ -d "$TARGET_PATH/.git" ]]; then
    IS_GIT_REPO=true
    echo -e "${COLOR_GREEN}✓ Repositorio Git detectado.${COLOR_RESET}"
fi

# 2. Configurar la rama Git 'feature/design-system-sync' si es repositorio Git
if [[ "$IS_GIT_REPO" == true ]]; then
    cd "$TARGET_PATH"
    echo -e "${COLOR_BLUE}→ Verificando estado de Git en $TARGET_PATH...${COLOR_RESET}"

    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        echo -e "${COLOR_YELLOW}Aviso: Existen cambios pendientes en el repositorio de destino.${COLOR_RESET}"
        read -rp "¿Continuar y cambiar de rama de todos modos? (s/N): " FORCE_GIT
        if [[ ! "$FORCE_GIT" =~ ^[sS]$ ]]; then
            echo "Operación cancelada."
            exit 0
        fi
    fi

    if git show-ref --quiet --heads "$BRANCH_NAME"; then
        echo -e "Cambiando a la rama existente '${COLOR_BOLD}$BRANCH_NAME${COLOR_RESET}'..."
        git checkout "$BRANCH_NAME"
    else
        echo -e "Creando y conmutando a la nueva rama '${COLOR_BOLD}$BRANCH_NAME${COLOR_RESET}'..."
        git checkout -b "$BRANCH_NAME"
    fi
fi

# 3. Preparar directorios de destino
echo -e "${COLOR_BLUE}→ Creando árbol de directorios para tokens, AvatarLaboratory y guías...${COLOR_RESET}"

# Estructura dentro del directorio 'feature/design-system-sync' y en docs
DIR_SYNC_ROOT="$TARGET_PATH/feature/design-system-sync"
DIR_DOCS_DS="$TARGET_PATH/docs/design-system"
DIR_DOCS_LAB="$TARGET_PATH/docs/avatar-laboratory"
DIR_DOCS_ENTREGAS="$TARGET_PATH/docs/entregas"
DIR_RAW="$TARGET_PATH/app/src/main/res/raw"

mkdir -p "$DIR_SYNC_ROOT/tokens"
mkdir -p "$DIR_SYNC_ROOT/avatar-laboratory"
mkdir -p "$DIR_SYNC_ROOT/entregas"
mkdir -p "$DIR_DOCS_DS"
mkdir -p "$DIR_DOCS_LAB"
mkdir -p "$DIR_DOCS_ENTREGAS"
mkdir -p "$DIR_RAW"

# 4. Copiar Tokens de Diseño y Animaciones Lottie (.json)
echo -e "${COLOR_BLUE}→ Exportando Tokens de Diseño y Animaciones Lottie...${COLOR_RESET}"
cp "$SCRIPT_DIR/src/themeTokens.ts" "$DIR_SYNC_ROOT/tokens/themeTokens.ts"
cp "$SCRIPT_DIR/src/themeTokens.ts" "$DIR_DOCS_DS/themeTokens.ts"

if [[ -f "$SCRIPT_DIR/LottieExportConfig.json" ]]; then
    cp "$SCRIPT_DIR/LottieExportConfig.json" "$DIR_SYNC_ROOT/tokens/LottieExportConfig.json"
    cp "$SCRIPT_DIR/LottieExportConfig.json" "$DIR_DOCS_DS/LottieExportConfig.json"
    cp "$SCRIPT_DIR/LottieExportConfig.json" "$TARGET_PATH/LottieExportConfig.json" 2>/dev/null || true
fi

if [[ -f "$SCRIPT_DIR/src/lottieConfig.ts" ]]; then
    cp "$SCRIPT_DIR/src/lottieConfig.ts" "$DIR_SYNC_ROOT/tokens/lottieConfig.ts"
    cp "$SCRIPT_DIR/src/lottieConfig.ts" "$DIR_DOCS_DS/lottieConfig.ts"
fi
echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} themeTokens.ts, LottieExportConfig.json, lottieConfig.ts"

# 4b. Copiar los 5 Archivos Lottie Bodymovin JSON para Android (res/raw)
echo -e "${COLOR_BLUE}→ Exportando los 5 archivos Lottie JSON para Android (res/raw)...${COLOR_RESET}"
mkdir -p "$DIR_SYNC_ROOT/res_raw_export"
mkdir -p "$TARGET_PATH/res_raw_export"

LOTTIE_SOURCE_DIR="$SCRIPT_DIR/res_raw_export"
if [[ -d "$LOTTIE_SOURCE_DIR" ]]; then
    for lottie_file in "$LOTTIE_SOURCE_DIR"/*.json; do
        if [[ -f "$lottie_file" ]]; then
            fname="$(basename "$lottie_file")"
            cp "$lottie_file" "$DIR_RAW/$fname"
            cp "$lottie_file" "$DIR_SYNC_ROOT/res_raw_export/$fname"
            cp "$lottie_file" "$TARGET_PATH/res_raw_export/$fname"
            echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} $fname -> app/src/main/res/raw/ & res_raw_export/"
        fi
    done
fi

# 5. Copiar Componentes del AvatarLaboratory y Pantallas
echo -e "${COLOR_BLUE}→ Exportando componentes de AvatarLaboratory y Pantallas...${COLOR_RESET}"
for comp in AvatarLaboratory.tsx AvatarVisual.tsx PixarAvatarSvg.tsx CinematicAvatarCanvas.tsx TokenViewer.tsx ScreenMusic.tsx ScreenIntelligence.tsx; do
    if [[ -f "$SCRIPT_DIR/src/components/$comp" ]]; then
        cp "$SCRIPT_DIR/src/components/$comp" "$DIR_SYNC_ROOT/avatar-laboratory/$comp"
        cp "$SCRIPT_DIR/src/components/$comp" "$DIR_DOCS_LAB/$comp"
        echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} src/components/$comp"
    fi
done

# Copiar submódulo de música jetAudio
if [[ -d "$SCRIPT_DIR/src/components/music" ]]; then
    mkdir -p "$DIR_SYNC_ROOT/music" "$DIR_DOCS_LAB/music"
    cp -r "$SCRIPT_DIR/src/components/music/"* "$DIR_SYNC_ROOT/music/"
    cp -r "$SCRIPT_DIR/src/components/music/"* "$DIR_DOCS_LAB/music/"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} src/components/music/* (Motor jetAudio & DSP Rack)"
fi

# Exporter de Lottie
if [[ -f "$SCRIPT_DIR/src/lottieExporter.ts" ]]; then
    cp "$SCRIPT_DIR/src/lottieExporter.ts" "$DIR_SYNC_ROOT/avatar-laboratory/lottieExporter.ts"
    cp "$SCRIPT_DIR/src/lottieExporter.ts" "$DIR_DOCS_LAB/lottieExporter.ts"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} src/lottieExporter.ts (Generador Bodymovin 5.5.2)"
fi

# 6. Copiar Guías de Despliegue e Integración para Claude Code
echo -e "${COLOR_BLUE}→ Exportando Guías de Despliegue y Handover...${COLOR_RESET}"
if [[ -d "$SCRIPT_DIR/entregas" ]]; then
    cp -r "$SCRIPT_DIR/entregas/"* "$DIR_SYNC_ROOT/entregas/"
    cp -r "$SCRIPT_DIR/entregas/"* "$DIR_DOCS_ENTREGAS/"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} entregas/*.md"
fi

if [[ -f "$SCRIPT_DIR/DEPLOY_CLAUDE_CODE.md" ]]; then
    cp "$SCRIPT_DIR/DEPLOY_CLAUDE_CODE.md" "$DIR_SYNC_ROOT/DEPLOY_CLAUDE_CODE.md"
    cp "$SCRIPT_DIR/DEPLOY_CLAUDE_CODE.md" "$DIR_DOCS_DS/DEPLOY_CLAUDE_CODE.md"
    cp "$SCRIPT_DIR/DEPLOY_CLAUDE_CODE.md" "$TARGET_PATH/DEPLOY_CLAUDE_CODE.md"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} DEPLOY_CLAUDE_CODE.md"
fi

if [[ -f "$SCRIPT_DIR/NOTA-GEMINI-GUIA-CLAVE-IA.md" ]]; then
    cp "$SCRIPT_DIR/NOTA-GEMINI-GUIA-CLAVE-IA.md" "$DIR_SYNC_ROOT/NOTA-GEMINI-GUIA-CLAVE-IA.md"
    cp "$SCRIPT_DIR/NOTA-GEMINI-GUIA-CLAVE-IA.md" "$DIR_DOCS_DS/NOTA-GEMINI-GUIA-CLAVE-IA.md"
    cp "$SCRIPT_DIR/NOTA-GEMINI-GUIA-CLAVE-IA.md" "$TARGET_PATH/NOTA-GEMINI-GUIA-CLAVE-IA.md"
    echo -e "  ${COLOR_GREEN}✓${COLOR_RESET} NOTA-GEMINI-GUIA-CLAVE-IA.md"
fi

# 7. Git Commit si es repositorio Git
if [[ "$IS_GIT_REPO" == true ]]; then
    echo -e "${COLOR_BLUE}→ Registrando cambios en Git (rama: $BRANCH_NAME)...${COLOR_RESET}"
    cd "$TARGET_PATH"
    git add "$DIR_SYNC_ROOT" "$TARGET_PATH/docs" "$DIR_RAW"
    if [[ -d "$TARGET_PATH/res_raw_export" ]]; then
        git add "$TARGET_PATH/res_raw_export"
    fi
    if [[ -f "$TARGET_PATH/DEPLOY_CLAUDE_CODE.md" ]]; then
        git add "$TARGET_PATH/DEPLOY_CLAUDE_CODE.md"
    fi
    if [[ -f "$TARGET_PATH/LottieExportConfig.json" ]]; then
        git add "$TARGET_PATH/LottieExportConfig.json"
    fi

    if git diff --cached --quiet; then
        echo -e "${COLOR_YELLOW}Los archivos ya estaban sincronizados en '$BRANCH_NAME'.${COLOR_RESET}"
    else
        COMMIT_MSG="feat(design-system): export design tokens, Lottie JSON assets and Claude Code deployment guide"
        git commit -m "$COMMIT_MSG"
        echo -e "${COLOR_GREEN}✓ Commit generado con éxito:${COLOR_RESET} \"$COMMIT_MSG\""
    fi
fi

echo ""
echo -e "${COLOR_BOLD}${COLOR_GREEN}====================================================================${COLOR_RESET}"
echo -e "${COLOR_BOLD}${COLOR_GREEN} ¡Exportación Completada Exitosamente!${COLOR_RESET}"
echo -e "${COLOR_BOLD}${COLOR_GREEN}====================================================================${COLOR_RESET}"
echo ""
echo -e "Estructura generada en el repositorio destino:"
echo -e "  - ${COLOR_BOLD}feature/design-system-sync/${COLOR_RESET} (Directorio unificado)"
echo -e "    ├── tokens/              (themeTokens.ts, LottieExportConfig.json, lottieConfig.ts)"
echo -e "    ├── avatar-laboratory/   (AvatarLaboratory.tsx, PixarAvatarSvg, lottieExporter.ts)"
echo -e "    ├── entregas/            (01_tokens_...md, 02_guia_lottie...md, 03_handover...md)"
echo -e "    └── DEPLOY_CLAUDE_CODE.md (Guía paso a paso para Claude Code)"
echo -e "  - ${COLOR_BOLD}docs/design-system/${COLOR_RESET} & ${COLOR_BOLD}docs/avatar-laboratory/${COLOR_RESET} (Documentación central)"
echo -e "  - ${COLOR_BOLD}app/src/main/res/raw/${COLOR_RESET} (Destino de animaciones Lottie .json)"
echo ""
echo -e "${COLOR_CYAN}Instrucción para Claude Code en el repositorio Android:${COLOR_RESET}"
echo -e "  \"Lee el archivo DEPLOY_CLAUDE_CODE.md y sigue los pasos para integrar"
echo -e "   los tokens de diseño y el componente VeyaAvatarLottie.kt en la rama $BRANCH_NAME.\""
echo ""
