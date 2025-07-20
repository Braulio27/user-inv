#!/bin/bash

# Script para generar reporte completo de testing
# Uso: ./scripts/test-report.sh

set -e

echo "🧪 GENERANDO INFORME DE TESTING..."
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar estado
show_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Función para mostrar métricas
show_metric() {
    echo -e "${BLUE}$1:${NC} $2"
}

echo -e "\n${BLUE}📊 EJECUTANDO TESTS CON COBERTURA...${NC}"
npm run test:coverage > test-output.log 2>&1
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Tests ejecutados exitosamente${NC}"
else
    echo -e "${YELLOW}⚠️  Algunos tests fallaron, pero continuando con el análisis...${NC}"
fi

echo -e "\n${BLUE}📈 ANALIZANDO RESULTADOS...${NC}"

# Extraer métricas del output
if [ -f "test-output.log" ]; then
    # Extraer cobertura total
    COVERAGE_STATEMENTS=$(grep -o "All files.*% Stmts" test-output.log | grep -o "[0-9.]*%" | head -1 || echo "0%")
    COVERAGE_BRANCHES=$(grep -o "All files.*% Branch" test-output.log | grep -o "[0-9.]*%" | head -1 || echo "0%")
    COVERAGE_FUNCTIONS=$(grep -o "All files.*% Funcs" test-output.log | grep -o "[0-9.]*%" | head -1 || echo "0%")
    COVERAGE_LINES=$(grep -o "All files.*% Lines" test-output.log | grep -o "[0-9.]*%" | head -1 || echo "0%")
    
    # Extraer estadísticas de tests
    TOTAL_TESTS=$(grep -o "Tests:.*total" test-output.log | grep -o "[0-9]* total" | grep -o "[0-9]*" || echo "0")
    PASSED_TESTS=$(grep -o "Tests:.*passed" test-output.log | grep -o "[0-9]* passed" | grep -o "[0-9]*" || echo "0")
    FAILED_TESTS=$(grep -o "Tests:.*failed" test-output.log | grep -o "[0-9]* failed" | grep -o "[0-9]*" || echo "0")
    
    # Calcular porcentaje de éxito
    if [ "$TOTAL_TESTS" -gt 0 ]; then
        SUCCESS_RATE=$(echo "scale=1; $PASSED_TESTS * 100 / $TOTAL_TESTS" | bc)
    else
        SUCCESS_RATE="0"
    fi
else
    echo -e "${RED}❌ No se pudo encontrar el archivo de output de tests${NC}"
    exit 1
fi

echo -e "\n${BLUE}📊 MÉTRICAS DE COBERTURA:${NC}"
show_metric "Statements" "$COVERAGE_STATEMENTS"
show_metric "Branches" "$COVERAGE_BRANCHES"
show_metric "Functions" "$COVERAGE_FUNCTIONS"
show_metric "Lines" "$COVERAGE_LINES"

echo -e "\n${BLUE}🧪 ESTADÍSTICAS DE TESTS:${NC}"
show_metric "Total de Tests" "$TOTAL_TESTS"
show_metric "Tests Exitosos" "$PASSED_TESTS"
show_metric "Tests Fallando" "$FAILED_TESTS"
show_metric "Tasa de Éxito" "${SUCCESS_RATE}%"

# Evaluar estado general
echo -e "\n${BLUE}🎯 EVALUACIÓN GENERAL:${NC}"

# Evaluar cobertura
COVERAGE_NUM=$(echo $COVERAGE_STATEMENTS | sed 's/%//')
if (( $(echo "$COVERAGE_NUM >= 80" | bc -l) )); then
    echo -e "${GREEN}✅ Cobertura Excelente (${COVERAGE_STATEMENTS})${NC}"
elif (( $(echo "$COVERAGE_NUM >= 60" | bc -l) )); then
    echo -e "${YELLOW}🟡 Cobertura Aceptable (${COVERAGE_STATEMENTS})${NC}"
else
    echo -e "${RED}🔴 Cobertura Crítica (${COVERAGE_STATEMENTS})${NC}"
fi

# Evaluar tasa de éxito
if (( $(echo "$SUCCESS_RATE >= 90" | bc -l) )); then
    echo -e "${GREEN}✅ Tests Muy Estables (${SUCCESS_RATE}%)${NC}"
elif (( $(echo "$SUCCESS_RATE >= 70" | bc -l) )); then
    echo -e "${YELLOW}🟡 Tests Moderadamente Estables (${SUCCESS_RATE}%)${NC}"
else
    echo -e "${RED}🔴 Tests Inestables (${SUCCESS_RATE}%)${NC}"
fi

# Generar recomendaciones
echo -e "\n${BLUE}💡 RECOMENDACIONES:${NC}"

if (( $(echo "$COVERAGE_NUM < 80" | bc -l) )); then
    echo -e "${YELLOW}📝 Aumentar cobertura de tests${NC}"
    echo "   - Implementar tests para componentes sin cobertura"
    echo "   - Agregar tests de casos edge"
    echo "   - Cubrir funciones no testeadas"
fi

if (( $(echo "$SUCCESS_RATE < 90" | bc -l) )); then
    echo -e "${YELLOW}🔧 Corregir tests fallando${NC}"
    echo "   - Revisar mocks de componentes"
    echo "   - Actualizar expectativas de tests"
    echo "   - Configurar testing para Material-UI"
fi

if [ "$FAILED_TESTS" -gt 0 ]; then
    echo -e "${YELLOW}🐛 Revisar tests fallando${NC}"
    echo "   - Verificar configuración de Jest"
    echo "   - Actualizar dependencias de testing"
    echo "   - Revisar mocks y stubs"
fi

# Generar resumen ejecutivo
echo -e "\n${BLUE}📋 RESUMEN EJECUTIVO:${NC}"
echo "Estado del Testing: $([ $TEST_EXIT_CODE -eq 0 ] && echo "✅ EXITOSO" || echo "⚠️  CON PROBLEMAS")"
echo "Cobertura Total: $COVERAGE_STATEMENTS"
echo "Tests Ejecutados: $TOTAL_TESTS"
echo "Tasa de Éxito: ${SUCCESS_RATE}%"

# Guardar reporte en archivo
REPORT_FILE="testing-report-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "INFORME DE TESTING - $(date)"
    echo "=================================="
    echo ""
    echo "MÉTRICAS DE COBERTURA:"
    echo "Statements: $COVERAGE_STATEMENTS"
    echo "Branches: $COVERAGE_BRANCHES"
    echo "Functions: $COVERAGE_FUNCTIONS"
    echo "Lines: $COVERAGE_LINES"
    echo ""
    echo "ESTADÍSTICAS DE TESTS:"
    echo "Total: $TOTAL_TESTS"
    echo "Exitosos: $PASSED_TESTS"
    echo "Fallando: $FAILED_TESTS"
    echo "Tasa de Éxito: ${SUCCESS_RATE}%"
    echo ""
    echo "ESTADO: $([ $TEST_EXIT_CODE -eq 0 ] && echo "EXITOSO" || echo "CON PROBLEMAS")"
} > "$REPORT_FILE"

echo -e "\n${GREEN}📄 Reporte guardado en: $REPORT_FILE${NC}"

# Limpiar archivo temporal
rm -f test-output.log

echo -e "\n${GREEN}✅ Análisis de testing completado${NC}" 