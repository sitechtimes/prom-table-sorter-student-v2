<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-500">
    <button
      @click="edittingForm = true"
      class="absolute top-6 bg-primary px-4 py-2 rounded shadow hover:bg-black transition"
      v-if="!edittingForm"
    >
      Want to edit a form? Click here
    </button>
    <div
      v-if="edittingForm && !loggedIn"
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Login using your verification code:
      </h1>
      <form @submit.prevent="leaderLogin()">
        <FormInput
          category="First Name"
          color="black"
          v-model="loginUser.firstName"
          type="text"
          placeholder="Enter here"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="loginUser.lastName"
          type="text"
          placeholder="Enter here"
        />
        <FormInput
          category="Verification Code"
          color="black"
          v-model="loginUser.verificationCode"
          type="text"
          placeholder="Enter here"
        />
        <button type="submit" class="btn btn-primary w-full mt-6">
          Submit Login
        </button>
      </form>
    </div>
    <div
      v-else
      class="card w-full border-2 border-black max-w-md bg-white shadow-xl p-6 cursor-default mt-6"
    >
      <h1 class="text-black text-3xl font-bold text-center mb-6">
        Student Form
      </h1>
      <form @submit.prevent="submit">
        <FormInput
          category="First Name"
          color="black"
          v-model="groupLeader.firstName"
          type="text"
          placeholder="Enter here"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="Last Name"
          color="black"
          v-model="groupLeader.lastName"
          type="text"
          placeholder="Enter here"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="NYC Students Email"
          color="black"
          v-model="groupLeader.email"
          type="email"
          placeholder="examples@nycstudents.net"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <FormInput
          category="OSIS"
          color="black"
          v-model="groupLeader.osis"
          type="text"
          placeholder="123456789"
          :class="hasError(0) ? 'border-red-500 border-2' : ''"
        />
        <h2 class="text-black text-lg font-semibold">
          Are you registering for a group?
        </h2>
        <input
          type="checkbox"
          v-model="InGroup"
          class="checkbox checkbox-primary mb-4"
          @change="clearGroup()"
        />

        <div v-if="InGroup" class="mb-6">
          <h2 class="text-black text-lg font-semibold">
            How many people are in your group? (up to 12 including yourself)
          </h2>
          <div class="w-full max-w-xs text-black">
            <input
              type="range"
              min="2"
              max="12"
              class="range range-primary"
              step="1"
              v-model.number="GroupSize"
              @input="organizeGroup()"
              :disabled="loggedIn"
            />
            <!-- MIGHT REMOVE :DISABLED, DEPENDS ON IF WE ALLOW ADDITIONAL STUDENTS TO BE ADDED/REMOVED FROM A GROUP AFTER SUBMISSION -->
            <div class="flex justify-between px-2.5 mt-2 text-xs">
              <span v-for="i in 11">|</span>
            </div>
          </div>
          <h3 class="text-black font-semibold text-center mt-4">
            Group Size: {{ GroupSize }}
          </h3>
        </div>

        <div v-if="InGroup" class="mt-6 space-y-3">
          <div
            v-for="i in GroupSize - 1"
            class="collapse collapse-arrow bg-base-100 border border-base-300 space-y-2"
          >
            <input type="radio" :name="'group-accordion'" :checked="i === 1" />
            <div class="collapse-title font-semibold">Member {{ i + 1 }}</div>
            <div class="collapse-content text-sm space-y-2">
              <FormInput
                category="First Name"
                color="white"
                v-model="Group[i]!.firstName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
              <FormInput
                category="Last Name"
                color="white"
                v-model="Group[i]!.lastName"
                type="text"
                placeholder="Enter"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
              <FormInput
                category="NYC Students Email"
                color="white"
                v-model="Group[i]!.email"
                type="email"
                placeholder="examples@nycstudents.net"
                :class="hasError(i) ? 'border-red-500 border-2' : ''"
              />
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-full mt-6">
          Submit Form
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
//(for me) make sure group slider's starting point is updated based on group size
const edittingForm = ref(false);
const loggedIn = ref(false);
const loginUser = reactive({
  firstName: "",
  lastName: "",
  verificationCode: "",
});
const groupLeader = reactive<Student>({
  firstName: "",
  lastName: "",
  email: "",
  osis: "",
});
const InGroup = ref(false);
const GroupSize = ref(1);
const Group = ref<Student[]>([groupLeader]);

// error handling for if students fail validation/duplicate checks
const failedIndexes = ref<number[]>([]);
function hasError(index: number) {
  return failedIndexes.value.includes(index);
}

async function leaderLogin() {
  const response = await fetch(""); //pull data from mongodb using backend
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].leader.first_name == loginUser.firstName &&
      data[i].leader.last == loginUser.lastName &&
      data[i].leader == loginUser.verificationCode //user still needs a verification code generated (via. mongodb)
    ) {
      loggedIn.value = true;
      edittingForm.value = true;
      return;
    }
  }
  alert("Incorrect name and/or verification");
}
function organizeGroup() {
  if (!InGroup.value) {
    Group.value = [groupLeader];
    return;
  }
  for (let i = Group.value.length; i < GroupSize.value; i++) {
    Group.value.push({ firstName: "", lastName: "", email: "" });
    Group.value[0] = groupLeader;
  }
}
function clearGroup() {
  if (InGroup.value) {
    GroupSize.value = 2;
    organizeGroup();
  } else {
    GroupSize.value = 1;
    Group.value = [groupLeader];
  }
}

async function submit() {
  const dataPush = {
    leader: groupLeader,
    members: Group.value.slice(1),
  };
  const osisCheck =
    (groupLeader.osis as string).length === 9 &&
    !isNaN(Number(groupLeader.osis));
  const emailCheck = groupLeader.email.includes("@nycstudents.net");

  if (!osisCheck || !emailCheck) {
    alert("Enter a 9 digit OSIS and an @nycstudents.net email");
    return;
  }

  if (edittingForm.value == true) {
    try {
      const res = await fetch("/api/grabGroup", {
        //update data on MongoDB (using backend)
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPush),
      });
      const data = await res.json();
    } catch (err) {
      alert("couldnt update data on mongodb");
      console.log(err);
    }
  } else {
    try {
      const res = await fetch("/api/editGroup", {
        //push data here (using backend)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataPush),
      });
      const data = await res.json();
      failedIndexes.value = [];
      if (!res.ok) {
        failedIndexes.value = data.data.failedIndexes;
        console.log("Failed Indexes:", failedIndexes.value);
        console.log("second test:", hasError(1));
        alert("Some entries had errors. Please check highlighted fields.");
      } else {
        alert("Submission successful!");
      }
    } catch (err) {
      alert("couldnt push data to mongodb");
      console.log(err);
    }
  }
}
</script>
