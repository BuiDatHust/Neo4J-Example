CREATE
(appota:ORGANIZATION{ name: "Appota", tax_code:"234798349374", description: "rfcr efd dcdc cdfc", slogan: "rfcr vfv m,kmmk", created_at: datetime(), updated_at: datetime(), detail_address: "vfvbjwie freoj" })
// (acheckin:ORGANIZATION{ name: "Acheckin", description: "rfcr efd dcdc cdfc", created_at: datetime(), updated_at: datetime() })
(vietel:ORGANIZATION{ name: "Vietel", tax_code:"433546566767", description: "rfcr efd dcdc cdfc", slogan: "rfcr vfv m,kmmk", created_at: datetime(), updated_at: datetime(), detail_address: "vfvbjwie freoj" })

(buidat:EMPLOYEE{ name: "buidat", dob:"cvdfvdf", phone:"09845456576", citizen_identification:"dvf mj dsded", tax_code:"234798349374", bank_account_number:"093403905", bank_name: "Vietcombank", email:"dinhtuan95qh@gmail.com", created_at: datetime(), updated_at: datetime() })
(quanbui:EMPLOYEE{ name: "quanbui", dob:"cvdfvdf", phone:"09845456576", citizen_identification:"dvf mj dsded", tax_code:"234798349374", bank_account_number:"093403905", bank_name: "Vietcombank", email:"dinhtuan95qh@gmail.com", created_at: datetime(), updated_at: datetime() })

(createEmployee:PERMISSION{ name: "Create Employee" })
(updateEmployee:PERMISSION{ name: "Update Employee" })

(teamleader:ROLE{ title: "Team Leader" })
(employeer:ROLE{ title: "Employeer" })

(buidat) -[:WORK_FOR { salary:40000000 }]-> (appota)
(buidat) -[:WORK_FOR { salary:40000000 }]-> (vietel)
// (appota) -[:HAS_CHILD { level:0 }]-> (acheckin)
(teamleader) -[:HAS_PERMISSION]-> (createEmployee)
(teamleader) -[:HAS_PERMISSION]-> (updateEmployee)
(appota) -[:HAS_ROLE] -> (teamleader)
(buidat) -[:IS_ROLE]-> (teamleader)
(quanbui) -[:IS_ROLE]-> (employeer)
(buidat) -[:MANAGE{ level: 1 }]-> (quanbui)
