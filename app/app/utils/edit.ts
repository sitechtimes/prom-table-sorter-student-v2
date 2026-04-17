const leader = reactive<Student>({
  firstName: "",
  lastName: "",
  email: "",
  osis: "",
});

const members = ref<Student[]>([]);
const groupLoaded = ref(false);
const failedIndexes = ref<number[]>([]);
const maxMembers = 11;

function addMember() {
  if (members.value.length >= maxMembers) return;

  members.value.push({
    firstName: "",
    lastName: "",
    email: "",
  });
}

function removeMember(index: number) {
  members.value.splice(index, 1);

  // clear errors tied to shifted indexes
  failedIndexes.value = failedIndexes.value
    .filter((i) => i !== index + 1)
    .map((i) => (i > index + 1 ? i - 1 : i));
}

function hasError(index: number) {
  return failedIndexes.value.includes(index);
}

const fetchGroup = async() => {
  try {
    const res = await fetch("/api/grabGroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leader }),
    });
    if (!res.ok) throw new Error("Group not found");
    const data = await res.json();
    members.value = data.members || [];
    groupLoaded.value = true;
  } catch {
    alert("Could not find group for this leader");
  }
}

async function submitEdits() {
  failedIndexes.value = [];

  try {
    const res = await fetch("/api/editGroup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leader,
        members: members.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      failedIndexes.value = data.data.failedIndexes || [];
      alert(data.message);
      return;
    }

    alert("Group updated successfully");
    await navigateTo("/");
  } catch {
    alert("Server error while updating group");
  }
}

export {
    leader, members, groupLoaded, failedIndexes, maxMembers, 
    addMember, removeMember, hasError, fetchGroup, submitEdits, 
}