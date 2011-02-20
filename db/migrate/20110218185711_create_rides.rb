class CreateRides < ActiveRecord::Migration
  def self.up
    create_table :rides do |t|
      t.string :content
      t.integer :user_id

      t.timestamps
    end
    add_index :rides, :user_id
  end

  def self.down
    drop_table :rides
  end
end
