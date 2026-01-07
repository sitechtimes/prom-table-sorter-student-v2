export interface Table {
    capacity: number
    unoccupiedSeats: number
    occupants: Array<Group>
}