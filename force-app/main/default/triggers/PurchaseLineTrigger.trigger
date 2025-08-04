trigger PurchaseLineTrigger on PurchaseLine__c (after insert, after update, after delete, after undelete) {
    Set<Id> purchaseIds = new Set<Id>();

    // Собираем PurchaseId из всех возможных событий
    if (Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete) {
        for (PurchaseLine__c line : Trigger.new) {
            if (line.PurchaseId__c != null) {
                purchaseIds.add(line.PurchaseId__c);
            }
        }
    }

    if (Trigger.isDelete) {
        for (PurchaseLine__c line : Trigger.old) {
            if (line.PurchaseId__c != null) {
                purchaseIds.add(line.PurchaseId__c);
            }
        }
    }

    if (purchaseIds.isEmpty()) return;

    // Считаем количество и сумму
    List<PurchaseLine__c> allLines = [
        SELECT PurchaseId__c, Amount__c, UnitCost__c
        FROM PurchaseLine__c
        WHERE PurchaseId__c IN :purchaseIds
    ];

// Группируем вручную и считаем
    Map<Id, Decimal> totalAmounts = new Map<Id, Decimal>();
    Map<Id, Integer> totalQuantities = new Map<Id, Integer>();

    for (PurchaseLine__c line : allLines) {
        Id pid = line.PurchaseId__c;

        Decimal lineTotal = line.UnitCost__c != null && line.Amount__c != null
            ? line.UnitCost__c * line.Amount__c : 0;

        Decimal currentTotal = totalAmounts.containsKey(pid) ? totalAmounts.get(pid) : 0;
        totalAmounts.put(pid, currentTotal + lineTotal);

        Integer currentQty = totalQuantities.containsKey(pid) ? totalQuantities.get(pid) : 0;
        totalQuantities.put(pid, currentQty + (line.Amount__c != null ? line.Amount__c.intValue() : 0));

    }

    // Обновляем родительские записи
    List<Purchase__c> updates = new List<Purchase__c>();
    for (Id pid : purchaseIds) {
        Purchase__c p = new Purchase__c(
            Id = pid,
            GrandTotal__c = totalAmounts.get(pid),
            TotalItems__c = totalQuantities.get(pid)
        );
        updates.add(p);
    }

    if (!updates.isEmpty()) {
        update updates;
    }
}