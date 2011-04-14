Factory.define :user do |user|
  user.name                  "Michael Hartl"
  user.email                 "mhartl@example.com"
  user.password              "foobar"
  user.password_confirmation "foobar"
end

Factory.sequence :email do |n|
  "person-#{n}@example.com"
end

Factory.define :ride do |ride|
	ride.title "Foo bar title"
  ride.route "Foo bar"
  ride.max_grade 5
  ride.total_distance 50.1
  ride.total_climb 2050
  ride.elevations "json array of integers"
  ride.association :user
end
