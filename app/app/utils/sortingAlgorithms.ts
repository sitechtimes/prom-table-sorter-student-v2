const algoFunctionOptions = [
    {
      name: 'Largest Groups --> Largest Tables (First)',
      groupSort: function (a: Group, b: Group) {
        return b.members.length - a.members.length
      },
      tableSort: function (a: Table , b: Table) {
        return b.unoccupiedSeats - a.unoccupiedSeats
      }
    },
    {
      name: 'Largest Groups --> Smallest Tables (First)',
      groupSort: function (a: Group, b: Group) {
        return b.members.length - a.members.length
      },
      tableSort: function (a: Table, b: Table) {
        return a.unoccupiedSeats - b.unoccupiedSeats
      }
    },
    {
      name: 'Smallest Groups --> Smallest Tables (First)',
      groupSort: function (a: Group, b: Group) {
        return a.members.length - b.members.length
      },
      tableSort: function (a: Table, b: Table) {
        return a.unoccupiedSeats - b.unoccupiedSeats
      }
    }
]
function getTopSort(arr: Array<Table>, sortFunc: Function) {
    let currentTopIndex = 0
    for (let i = 1; i < arr.length; i++) {
    if (sortFunc(arr[i], arr[currentTopIndex]) < 0) {
        currentTopIndex = i
    }}
    return currentTopIndex
}

function sortTableSeats(groups: Array<Group>, tables: Array<Table>, groupSortFunc: (a: Group, b: Group) => number , tableSortFunc: Function): Table[]|null {
    let tableObjs = <Array<Table>>[]
    tables.forEach((table) => {
      tableObjs.push({
        capacity: table.capacity ?? 0,
        unoccupiedSeats: table.unoccupiedSeats ?? 0,
        occupants: [...table.occupants] ?? []
      })
    })
    groups.sort(groupSortFunc)
  
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i]
        const topTableIndex = getTopSort(tableObjs, tableSortFunc)
        const topTable = tableObjs[topTableIndex]
    
        if (!topTable || !group) return null
    
        if (topTable.unoccupiedSeats >= (group.members.length+1)) {
          topTable.occupants.push(group)
          topTable.unoccupiedSeats -= (group.members.length+1)
        } else {
          return null
        }
      }
    
      return tableObjs
  }
function mainSort( //delete if not used, doesnt handle edge cases currently
    mainGroups: Array<Group>,
    mainTables: Array<Table>,
    algoOptions: Array<any>
  ) {
    let result = null
    for (let i = 0; i < algoOptions.length; i++) {
      result = sortTableSeats(
        mainGroups,
        mainTables,
        algoOptions[i].groupSort,
        algoOptions[i].tableSort
      )
      if (result != null) break
    }
    return result
}

function rangeSort(
    groupArr: Array<Group>,
    algoOptions: Array<any>,
    maxSeats: number,
    minSeats = 0
  ) {
    const totalGuests = arrayLen2D(groupArr)
    const tableCount = Math.ceil(totalGuests / maxSeats)
    const additionalTables = ref(0)
    const tableArr: Array<Table> = []
    for (let i = 0; i < tableCount; i++) {
        tableArr.push({
            capacity: maxSeats,
            unoccupiedSeats: maxSeats,
            occupants: [],
    })}
  
    let result: any = null
    const maxAdditionalTables = groupArr.length - tableArr.length
  
    for (let n = 0; n <= maxAdditionalTables; n++) {
      for (let i = 0; i < algoOptions.length; i++) {
        result = sortTableSeats(
          groupArr,
          tableArr,
          algoOptions[i].groupSort,
          algoOptions[i].tableSort
        )
  
        if (result != null) {
            let isValidResult = true
            for (let i = 0; i < result.length; i++) {
              if (arrayLen2D(result[i].occupants) < minSeats) {
                isValidResult = false
                break
              }
            }
            if (isValidResult) return result
        }
      }
  
      // add another table if not working
      tableArr.push({
        capacity: maxSeats,
        unoccupiedSeats: maxSeats,
        occupants: [],
      })
      additionalTables.value+=1
      //should return additionalTables.value
    }
    
    throw Error(
      `ERROR: Groups cannot be sorted into tables with current settings, as a group will end up split up no matter what or a table can not be filled to the minimum. Try lowering the minimum or increasing the maximum table size.`
    )
    
}
  
function arrayLen2D(list2D: Array<Group>): number {
    let sum = 0
    for (let i = 0; i < list2D.length; i++) {
        const group = list2D[i]
        if (group && group.members) {
            sum += (group.members.length+1)
        }
    }
    return sum
}

function findLargest(groups: Group[]): Group | null {
    if (groups.length === 0) return null;
    return groups.reduce((a, b) => (compareArrays(a, b) > 0 ? a : b));
}

function findSmallest(groups: Group[]): Group | null  {
    if (groups.length === 0) return null;
    return groups.reduce((a, b) => (compareArrays(a, b) < 0 ? a : b));
}

function compareArrays(a: Group, b: Group) {
    return a.members.length - b.members.length;
}

export {
  algoFunctionOptions,
  findLargest,
  findSmallest,
  compareArrays,
  mainSort,
  rangeSort,
  arrayLen2D,
}