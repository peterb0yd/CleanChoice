create table customer_statuses (
	id int not null auto_increment,
    status_name varchar(10),
    primary key (id)
);

create table marketing_channels (
	id int not null auto_increment,
    channel_name varchar(15),
    primary key (id)
);

create table customer_accounts (
	id int not null auto_increment,
    status_id int not null,
    full_name varchar(20) not null,
    service_address varchar(50),
    phone varchar(12),
    email varchar(30), 
    electricity_utility varchar(30), 
    account_number int unique, 
    foreign key(status_id) references customer_statuses(id), 
    primary key (id)
);

create table enrollment_attempts ( 
	id int not null auto_increment, 
    customer_id int not null,
    marketing_channel_id int not null,
	foreign key(customer_id) references customer_accounts(id), 
	foreign key(marketing_channel_id) references marketing_channels(id), 
	date_recorded date, 
    primary key (id)
);

insert into customer_statuses (status_name)
values ('Pending'), ('Accepted'), ('Rejected'), ('Closed');

insert into marketing_channels (channel_name)
values ('Mail'), ('Telemarketing'), ('Web');