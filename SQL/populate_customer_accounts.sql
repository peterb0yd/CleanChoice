# Populate customer_accounts table with data

insert into customer_accounts (
	status_id,
    full_name,
    service_address,
    phone,
    email,
    electricity_utility,
    account_number
)
values
(
	2,
    'Peter Boyd',
    '1310 Noyes Dr 20910',
    '2407235209',
    'peterboyd192@gmail.com',
    'Pepco',
    1234567
),
(
	3,
	'Joe Shmoe',
    '444 16th St. 20001',
    '2409553212',
    'joe@gmail.com',
    'Pepco',
    1233466
),
(
	1,
    'Bob Smith',
    '5434 Georgia Ave 20910',
    '3555553333',
    'bobs@gmail.com',
    'Pepco',
    3425555
);
