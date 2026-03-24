from django.core.management.base import BaseCommand

from grocery.models import GroceryItem


class Command(BaseCommand):
    help = "Seed the database with sample grocery items"

    def handle(self, *args, **options):
        items = [
            {"name": "milk", "completed": True},
            {"name": "bread", "completed": True},
            {"name": "eggs", "completed": False},
            {"name": "butter", "completed": False},
        ]

        created_count = 0
        for data in items:
            obj, created = GroceryItem.objects.get_or_create(
                name=data["name"],
                defaults={"completed": data["completed"]},
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f"Seeded grocery items (created {created_count} new)")
        )

