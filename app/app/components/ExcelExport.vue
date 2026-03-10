<template>
  <a
    v-if="downloadExcelLink == null"
    class="btn w-full mb-4 pointer-events-none opacity-60 sm:w-[75%] md:w-[50%]"
  >
    Enter an excel and sort for a download link
  </a>

  <a v-else :href="downloadExcelLink" class="btn btn-primary w-full mb-4">
    Download Tables (Excel File)
  </a>
</template>
<script setup lang="ts">
import ExcelJS from "exceljs";
const downloadExcelLink = ref<string | null>(null);
const props = defineProps<{
  tables: Table[];
  notPaid: Student[];
  notRegistered: ImportedStudent[];
}>();
const tables = props.tables;
const notPaid = props.notPaid;
const notRegistered = props.notRegistered;
async function exportAsExcel() {
  const exportWorkbook = new ExcelJS.Workbook();
  const sortedWorksheet = exportWorkbook.addWorksheet("Comparison Worksheet");
  sortedWorksheet.getCell("A1").value = "All Tables";
  sortedWorksheet.getCell("B1").value = "Emails";
  sortedWorksheet.getCell("F1").value = "Haven't paid & Registered";
  sortedWorksheet.getCell("H1").value = "Paid & Not Registered";

  let tableIndex = 1;
  let rowIndex = tableIndex;
  tables.forEach((table) => {
    sortedWorksheet.getRow(rowIndex).getCell(1).value = `Table ${tableIndex}`;
    tableIndex += 1;
    rowIndex += 1;

    table.occupants.forEach((occupant) => {
      sortedWorksheet.getRow(rowIndex).getCell(1).value =
        `${occupant.leader.firstName} ${occupant.leader.lastName}`;
      sortedWorksheet.getRow(rowIndex).getCell(2).value =
        `${occupant.leader.email}`;
      rowIndex += 1;
      occupant.members.forEach((member) => {
        sortedWorksheet.getRow(rowIndex).getCell(1).value =
          `${member.firstName} ${member.lastName}`;
        sortedWorksheet.getRow(rowIndex).getCell(2).value = member.email;
        rowIndex += 1;
      });
    });
  });

  for (let i = 0; i < notPaid.length; i++) {
    sortedWorksheet.getRow(i + 2).getCell(6).value =
      `${notPaid[i]?.firstName} ${notPaid[i]?.lastName}`;
  }

  for (let i = 0; i < notRegistered.length; i++) {
    sortedWorksheet.getRow(i + 2).getCell(8).value = notRegistered[i]?.name;
  }

  const buffer = await exportWorkbook.xlsx.writeBuffer();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const blob = new Blob([buffer], { type: fileType });
  downloadExcelLink.value = URL.createObjectURL(blob);
}
watch(tables, () => {
  exportAsExcel();
});
onMounted(() => {
  exportAsExcel();
});
</script>
