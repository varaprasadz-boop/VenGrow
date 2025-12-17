// Comprehensive Indian States and Cities Data
// Includes all 28 States and 8 Union Territories with major cities

export interface State {
  code: string;
  name: string;
  type: "state" | "ut"; // State or Union Territory
}

export interface City {
  name: string;
  stateCode: string;
}

export const INDIAN_STATES: State[] = [
  // States (28)
  { code: "AP", name: "Andhra Pradesh", type: "state" },
  { code: "AR", name: "Arunachal Pradesh", type: "state" },
  { code: "AS", name: "Assam", type: "state" },
  { code: "BR", name: "Bihar", type: "state" },
  { code: "CG", name: "Chhattisgarh", type: "state" },
  { code: "GA", name: "Goa", type: "state" },
  { code: "GJ", name: "Gujarat", type: "state" },
  { code: "HR", name: "Haryana", type: "state" },
  { code: "HP", name: "Himachal Pradesh", type: "state" },
  { code: "JH", name: "Jharkhand", type: "state" },
  { code: "KA", name: "Karnataka", type: "state" },
  { code: "KL", name: "Kerala", type: "state" },
  { code: "MP", name: "Madhya Pradesh", type: "state" },
  { code: "MH", name: "Maharashtra", type: "state" },
  { code: "MN", name: "Manipur", type: "state" },
  { code: "ML", name: "Meghalaya", type: "state" },
  { code: "MZ", name: "Mizoram", type: "state" },
  { code: "NL", name: "Nagaland", type: "state" },
  { code: "OD", name: "Odisha", type: "state" },
  { code: "PB", name: "Punjab", type: "state" },
  { code: "RJ", name: "Rajasthan", type: "state" },
  { code: "SK", name: "Sikkim", type: "state" },
  { code: "TN", name: "Tamil Nadu", type: "state" },
  { code: "TS", name: "Telangana", type: "state" },
  { code: "TR", name: "Tripura", type: "state" },
  { code: "UK", name: "Uttarakhand", type: "state" },
  { code: "UP", name: "Uttar Pradesh", type: "state" },
  { code: "WB", name: "West Bengal", type: "state" },
  
  // Union Territories (8)
  { code: "AN", name: "Andaman and Nicobar Islands", type: "ut" },
  { code: "CH", name: "Chandigarh", type: "ut" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut" },
  { code: "DL", name: "Delhi", type: "ut" },
  { code: "JK", name: "Jammu and Kashmir", type: "ut" },
  { code: "LA", name: "Ladakh", type: "ut" },
  { code: "LD", name: "Lakshadweep", type: "ut" },
  { code: "PY", name: "Puducherry", type: "ut" },
];

export const INDIAN_CITIES: City[] = [
  // Andhra Pradesh
  { name: "Visakhapatnam", stateCode: "AP" },
  { name: "Vijayawada", stateCode: "AP" },
  { name: "Guntur", stateCode: "AP" },
  { name: "Nellore", stateCode: "AP" },
  { name: "Kurnool", stateCode: "AP" },
  { name: "Tirupati", stateCode: "AP" },
  { name: "Rajahmundry", stateCode: "AP" },
  { name: "Kakinada", stateCode: "AP" },
  { name: "Kadapa", stateCode: "AP" },
  { name: "Anantapur", stateCode: "AP" },
  
  // Arunachal Pradesh
  { name: "Itanagar", stateCode: "AR" },
  { name: "Naharlagun", stateCode: "AR" },
  { name: "Pasighat", stateCode: "AR" },
  { name: "Tawang", stateCode: "AR" },
  
  // Assam
  { name: "Guwahati", stateCode: "AS" },
  { name: "Silchar", stateCode: "AS" },
  { name: "Dibrugarh", stateCode: "AS" },
  { name: "Jorhat", stateCode: "AS" },
  { name: "Nagaon", stateCode: "AS" },
  { name: "Tinsukia", stateCode: "AS" },
  { name: "Tezpur", stateCode: "AS" },
  
  // Bihar
  { name: "Patna", stateCode: "BR" },
  { name: "Gaya", stateCode: "BR" },
  { name: "Bhagalpur", stateCode: "BR" },
  { name: "Muzaffarpur", stateCode: "BR" },
  { name: "Darbhanga", stateCode: "BR" },
  { name: "Bihar Sharif", stateCode: "BR" },
  { name: "Purnia", stateCode: "BR" },
  { name: "Arrah", stateCode: "BR" },
  { name: "Begusarai", stateCode: "BR" },
  
  // Chhattisgarh
  { name: "Raipur", stateCode: "CG" },
  { name: "Bhilai", stateCode: "CG" },
  { name: "Bilaspur", stateCode: "CG" },
  { name: "Korba", stateCode: "CG" },
  { name: "Durg", stateCode: "CG" },
  { name: "Rajnandgaon", stateCode: "CG" },
  { name: "Raigarh", stateCode: "CG" },
  
  // Goa
  { name: "Panaji", stateCode: "GA" },
  { name: "Margao", stateCode: "GA" },
  { name: "Vasco da Gama", stateCode: "GA" },
  { name: "Mapusa", stateCode: "GA" },
  { name: "Ponda", stateCode: "GA" },
  
  // Gujarat
  { name: "Ahmedabad", stateCode: "GJ" },
  { name: "Surat", stateCode: "GJ" },
  { name: "Vadodara", stateCode: "GJ" },
  { name: "Rajkot", stateCode: "GJ" },
  { name: "Bhavnagar", stateCode: "GJ" },
  { name: "Jamnagar", stateCode: "GJ" },
  { name: "Junagadh", stateCode: "GJ" },
  { name: "Gandhinagar", stateCode: "GJ" },
  { name: "Anand", stateCode: "GJ" },
  { name: "Nadiad", stateCode: "GJ" },
  { name: "Morbi", stateCode: "GJ" },
  { name: "Mehsana", stateCode: "GJ" },
  { name: "Bharuch", stateCode: "GJ" },
  { name: "Vapi", stateCode: "GJ" },
  { name: "Navsari", stateCode: "GJ" },
  
  // Haryana
  { name: "Faridabad", stateCode: "HR" },
  { name: "Gurgaon", stateCode: "HR" },
  { name: "Panipat", stateCode: "HR" },
  { name: "Ambala", stateCode: "HR" },
  { name: "Yamunanagar", stateCode: "HR" },
  { name: "Rohtak", stateCode: "HR" },
  { name: "Hisar", stateCode: "HR" },
  { name: "Karnal", stateCode: "HR" },
  { name: "Sonipat", stateCode: "HR" },
  { name: "Panchkula", stateCode: "HR" },
  
  // Himachal Pradesh
  { name: "Shimla", stateCode: "HP" },
  { name: "Dharamshala", stateCode: "HP" },
  { name: "Solan", stateCode: "HP" },
  { name: "Mandi", stateCode: "HP" },
  { name: "Kullu", stateCode: "HP" },
  { name: "Manali", stateCode: "HP" },
  { name: "Palampur", stateCode: "HP" },
  
  // Jharkhand
  { name: "Ranchi", stateCode: "JH" },
  { name: "Jamshedpur", stateCode: "JH" },
  { name: "Dhanbad", stateCode: "JH" },
  { name: "Bokaro", stateCode: "JH" },
  { name: "Hazaribagh", stateCode: "JH" },
  { name: "Deoghar", stateCode: "JH" },
  { name: "Giridih", stateCode: "JH" },
  
  // Karnataka
  { name: "Bengaluru", stateCode: "KA" },
  { name: "Mysuru", stateCode: "KA" },
  { name: "Mangaluru", stateCode: "KA" },
  { name: "Hubli", stateCode: "KA" },
  { name: "Dharwad", stateCode: "KA" },
  { name: "Belgaum", stateCode: "KA" },
  { name: "Gulbarga", stateCode: "KA" },
  { name: "Davangere", stateCode: "KA" },
  { name: "Bellary", stateCode: "KA" },
  { name: "Shimoga", stateCode: "KA" },
  { name: "Tumkur", stateCode: "KA" },
  { name: "Udupi", stateCode: "KA" },
  
  // Kerala
  { name: "Thiruvananthapuram", stateCode: "KL" },
  { name: "Kochi", stateCode: "KL" },
  { name: "Kozhikode", stateCode: "KL" },
  { name: "Thrissur", stateCode: "KL" },
  { name: "Kollam", stateCode: "KL" },
  { name: "Kannur", stateCode: "KL" },
  { name: "Alappuzha", stateCode: "KL" },
  { name: "Palakkad", stateCode: "KL" },
  { name: "Kottayam", stateCode: "KL" },
  { name: "Malappuram", stateCode: "KL" },
  
  // Madhya Pradesh
  { name: "Bhopal", stateCode: "MP" },
  { name: "Indore", stateCode: "MP" },
  { name: "Jabalpur", stateCode: "MP" },
  { name: "Gwalior", stateCode: "MP" },
  { name: "Ujjain", stateCode: "MP" },
  { name: "Sagar", stateCode: "MP" },
  { name: "Satna", stateCode: "MP" },
  { name: "Dewas", stateCode: "MP" },
  { name: "Ratlam", stateCode: "MP" },
  { name: "Rewa", stateCode: "MP" },
  { name: "Katni", stateCode: "MP" },
  { name: "Singrauli", stateCode: "MP" },
  
  // Maharashtra
  { name: "Mumbai", stateCode: "MH" },
  { name: "Pune", stateCode: "MH" },
  { name: "Nagpur", stateCode: "MH" },
  { name: "Thane", stateCode: "MH" },
  { name: "Nashik", stateCode: "MH" },
  { name: "Aurangabad", stateCode: "MH" },
  { name: "Solapur", stateCode: "MH" },
  { name: "Kolhapur", stateCode: "MH" },
  { name: "Amravati", stateCode: "MH" },
  { name: "Navi Mumbai", stateCode: "MH" },
  { name: "Sangli", stateCode: "MH" },
  { name: "Akola", stateCode: "MH" },
  { name: "Jalgaon", stateCode: "MH" },
  { name: "Latur", stateCode: "MH" },
  { name: "Dhule", stateCode: "MH" },
  { name: "Ahmednagar", stateCode: "MH" },
  { name: "Chandrapur", stateCode: "MH" },
  { name: "Parbhani", stateCode: "MH" },
  { name: "Nanded", stateCode: "MH" },
  { name: "Panvel", stateCode: "MH" },
  
  // Manipur
  { name: "Imphal", stateCode: "MN" },
  { name: "Thoubal", stateCode: "MN" },
  { name: "Bishnupur", stateCode: "MN" },
  
  // Meghalaya
  { name: "Shillong", stateCode: "ML" },
  { name: "Tura", stateCode: "ML" },
  { name: "Jowai", stateCode: "ML" },
  
  // Mizoram
  { name: "Aizawl", stateCode: "MZ" },
  { name: "Lunglei", stateCode: "MZ" },
  { name: "Champhai", stateCode: "MZ" },
  
  // Nagaland
  { name: "Kohima", stateCode: "NL" },
  { name: "Dimapur", stateCode: "NL" },
  { name: "Mokokchung", stateCode: "NL" },
  
  // Odisha
  { name: "Bhubaneswar", stateCode: "OD" },
  { name: "Cuttack", stateCode: "OD" },
  { name: "Rourkela", stateCode: "OD" },
  { name: "Brahmapur", stateCode: "OD" },
  { name: "Sambalpur", stateCode: "OD" },
  { name: "Puri", stateCode: "OD" },
  { name: "Balasore", stateCode: "OD" },
  { name: "Bhadrak", stateCode: "OD" },
  
  // Punjab
  { name: "Ludhiana", stateCode: "PB" },
  { name: "Amritsar", stateCode: "PB" },
  { name: "Jalandhar", stateCode: "PB" },
  { name: "Patiala", stateCode: "PB" },
  { name: "Bathinda", stateCode: "PB" },
  { name: "Mohali", stateCode: "PB" },
  { name: "Pathankot", stateCode: "PB" },
  { name: "Hoshiarpur", stateCode: "PB" },
  { name: "Moga", stateCode: "PB" },
  
  // Rajasthan
  { name: "Jaipur", stateCode: "RJ" },
  { name: "Jodhpur", stateCode: "RJ" },
  { name: "Kota", stateCode: "RJ" },
  { name: "Bikaner", stateCode: "RJ" },
  { name: "Ajmer", stateCode: "RJ" },
  { name: "Udaipur", stateCode: "RJ" },
  { name: "Bhilwara", stateCode: "RJ" },
  { name: "Alwar", stateCode: "RJ" },
  { name: "Bharatpur", stateCode: "RJ" },
  { name: "Sikar", stateCode: "RJ" },
  { name: "Sri Ganganagar", stateCode: "RJ" },
  { name: "Pali", stateCode: "RJ" },
  
  // Sikkim
  { name: "Gangtok", stateCode: "SK" },
  { name: "Namchi", stateCode: "SK" },
  { name: "Pelling", stateCode: "SK" },
  
  // Tamil Nadu
  { name: "Chennai", stateCode: "TN" },
  { name: "Coimbatore", stateCode: "TN" },
  { name: "Madurai", stateCode: "TN" },
  { name: "Tiruchirappalli", stateCode: "TN" },
  { name: "Salem", stateCode: "TN" },
  { name: "Tirunelveli", stateCode: "TN" },
  { name: "Tiruppur", stateCode: "TN" },
  { name: "Vellore", stateCode: "TN" },
  { name: "Erode", stateCode: "TN" },
  { name: "Thoothukudi", stateCode: "TN" },
  { name: "Dindigul", stateCode: "TN" },
  { name: "Thanjavur", stateCode: "TN" },
  { name: "Nagercoil", stateCode: "TN" },
  { name: "Kanchipuram", stateCode: "TN" },
  
  // Telangana
  { name: "Hyderabad", stateCode: "TS" },
  { name: "Warangal", stateCode: "TS" },
  { name: "Nizamabad", stateCode: "TS" },
  { name: "Karimnagar", stateCode: "TS" },
  { name: "Khammam", stateCode: "TS" },
  { name: "Ramagundam", stateCode: "TS" },
  { name: "Mahbubnagar", stateCode: "TS" },
  { name: "Nalgonda", stateCode: "TS" },
  { name: "Adilabad", stateCode: "TS" },
  { name: "Secunderabad", stateCode: "TS" },
  
  // Tripura
  { name: "Agartala", stateCode: "TR" },
  { name: "Udaipur", stateCode: "TR" },
  { name: "Dharmanagar", stateCode: "TR" },
  
  // Uttarakhand
  { name: "Dehradun", stateCode: "UK" },
  { name: "Haridwar", stateCode: "UK" },
  { name: "Roorkee", stateCode: "UK" },
  { name: "Haldwani", stateCode: "UK" },
  { name: "Kashipur", stateCode: "UK" },
  { name: "Rudrapur", stateCode: "UK" },
  { name: "Rishikesh", stateCode: "UK" },
  { name: "Nainital", stateCode: "UK" },
  { name: "Mussoorie", stateCode: "UK" },
  
  // Uttar Pradesh
  { name: "Lucknow", stateCode: "UP" },
  { name: "Kanpur", stateCode: "UP" },
  { name: "Ghaziabad", stateCode: "UP" },
  { name: "Agra", stateCode: "UP" },
  { name: "Varanasi", stateCode: "UP" },
  { name: "Meerut", stateCode: "UP" },
  { name: "Prayagraj", stateCode: "UP" },
  { name: "Bareilly", stateCode: "UP" },
  { name: "Aligarh", stateCode: "UP" },
  { name: "Moradabad", stateCode: "UP" },
  { name: "Saharanpur", stateCode: "UP" },
  { name: "Gorakhpur", stateCode: "UP" },
  { name: "Noida", stateCode: "UP" },
  { name: "Greater Noida", stateCode: "UP" },
  { name: "Firozabad", stateCode: "UP" },
  { name: "Jhansi", stateCode: "UP" },
  { name: "Mathura", stateCode: "UP" },
  { name: "Muzaffarnagar", stateCode: "UP" },
  { name: "Shahjahanpur", stateCode: "UP" },
  { name: "Rampur", stateCode: "UP" },
  { name: "Ayodhya", stateCode: "UP" },
  
  // West Bengal
  { name: "Kolkata", stateCode: "WB" },
  { name: "Howrah", stateCode: "WB" },
  { name: "Durgapur", stateCode: "WB" },
  { name: "Asansol", stateCode: "WB" },
  { name: "Siliguri", stateCode: "WB" },
  { name: "Bardhaman", stateCode: "WB" },
  { name: "Malda", stateCode: "WB" },
  { name: "Kharagpur", stateCode: "WB" },
  { name: "Haldia", stateCode: "WB" },
  { name: "Darjeeling", stateCode: "WB" },
  { name: "Jalpaiguri", stateCode: "WB" },
  
  // Union Territories
  // Andaman and Nicobar Islands
  { name: "Port Blair", stateCode: "AN" },
  
  // Chandigarh
  { name: "Chandigarh", stateCode: "CH" },
  
  // Dadra and Nagar Haveli and Daman and Diu
  { name: "Silvassa", stateCode: "DN" },
  { name: "Daman", stateCode: "DN" },
  { name: "Diu", stateCode: "DN" },
  
  // Delhi
  { name: "New Delhi", stateCode: "DL" },
  { name: "Delhi", stateCode: "DL" },
  { name: "Dwarka", stateCode: "DL" },
  { name: "Rohini", stateCode: "DL" },
  { name: "Saket", stateCode: "DL" },
  { name: "Vasant Kunj", stateCode: "DL" },
  
  // Jammu and Kashmir
  { name: "Srinagar", stateCode: "JK" },
  { name: "Jammu", stateCode: "JK" },
  { name: "Anantnag", stateCode: "JK" },
  { name: "Baramulla", stateCode: "JK" },
  { name: "Udhampur", stateCode: "JK" },
  
  // Ladakh
  { name: "Leh", stateCode: "LA" },
  { name: "Kargil", stateCode: "LA" },
  
  // Lakshadweep
  { name: "Kavaratti", stateCode: "LD" },
  
  // Puducherry
  { name: "Puducherry", stateCode: "PY" },
  { name: "Karaikal", stateCode: "PY" },
  { name: "Mahe", stateCode: "PY" },
  { name: "Yanam", stateCode: "PY" },
];

// Helper function to get cities by state code
export function getCitiesByState(stateCode: string): City[] {
  return INDIAN_CITIES.filter((city) => city.stateCode === stateCode);
}

// Helper function to get state by code
export function getStateByCode(code: string): State | undefined {
  return INDIAN_STATES.find((state) => state.code === code);
}

// Helper function to get state by name
export function getStateByName(name: string): State | undefined {
  return INDIAN_STATES.find(
    (state) => state.name.toLowerCase() === name.toLowerCase()
  );
}

// Helper to check if a city exists in a state
export function cityExistsInState(cityName: string, stateCode: string): boolean {
  return INDIAN_CITIES.some(
    (city) =>
      city.stateCode === stateCode &&
      city.name.toLowerCase() === cityName.toLowerCase()
  );
}

// Special value for "Other" option
export const OTHER_CITY_VALUE = "__other__";
