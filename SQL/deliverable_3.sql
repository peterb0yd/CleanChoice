
select 
	m.id `ID`, 
    m.channel_name `Channel Name`,
    count(*) `Total Customers`,
    min(e.date_recorded) `Earliest Attempt`,
    max(e.date_recorded) `Latest Attempt`
from marketing_channels m
	join enrollment_attempts e
		on e.marketing_channel_id = m.id
group by m.id;


