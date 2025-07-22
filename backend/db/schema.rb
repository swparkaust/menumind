# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_22_102200) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "ai_interactions", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "prompt"
    t.text "response"
    t.json "context_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_ai_interactions_on_user_id"
  end

  create_table "menu_recommendations", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "menu_name", null: false
    t.text "description"
    t.string "food_type", null: false
    t.string "cuisine_type", null: false
    t.string "situation", null: false
    t.boolean "accepted", default: false
    t.boolean "declined", default: false
    t.datetime "recommended_at", null: false
    t.datetime "responded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.json "context"
    t.index ["menu_name"], name: "index_menu_recommendations_on_menu_name"
    t.index ["user_id", "recommended_at"], name: "index_menu_recommendations_on_user_id_and_recommended_at"
    t.index ["user_id"], name: "index_menu_recommendations_on_user_id"
  end

  create_table "user_insights", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "insight_type"
    t.json "insight_data"
    t.datetime "generated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_insights_on_user_id"
  end

  create_table "user_preferences", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "food_type"
    t.string "cuisine_type"
    t.string "situation"
    t.float "preference_weight"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_preferences_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "timezone"
    t.decimal "location_lat", precision: 10, scale: 6
    t.decimal "location_lng", precision: 10, scale: 6
    t.json "preferences", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_admin", default: false, null: false
    t.index ["is_admin"], name: "index_users_on_is_admin"
    t.index ["uuid"], name: "index_users_on_uuid", unique: true
  end

  add_foreign_key "ai_interactions", "users"
  add_foreign_key "menu_recommendations", "users"
  add_foreign_key "user_insights", "users"
  add_foreign_key "user_preferences", "users"
end
